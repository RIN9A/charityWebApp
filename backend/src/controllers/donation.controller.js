const db = require("../db");
const { hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants/index");
const CryptoJS = require("crypto-js");

exports.addDonation = async (req, res) => {
  const { time_pay, amount, email } = req.body;

  //console.log(CryptoJS.lib.WordArray)

  const id = CryptoJS.lib.WordArray.random(16).toString();
  console.log(id.length);
  const ogrn = await db.query("SELECT * FROM organizations WHERE id = $1", [
    req.params.organizationId,
  ]);
  const donationSum = await db.query(
    'SELECT * FROM public."sumDonation" WHERE organization_id = $1',
    [req.params.organizationId]
  );
  if (donationSum.rows.length) {
    await db.query(
      'UPDATE public."sumDonation" SET summa = (summa + $1) WHERE organization_id = $2',
      [amount, req.params.organizationId]
    );
  } else {
    await db.query(
      'INSERT INTO public."sumDonation"(id, organization_id, summa, ogrn)  VALUES ($1, $2, $3, $4)',
      [id, req.params.organizationId, amount, ogrn.rows[0].ogrn]
    );
  }

  try {
    if (time_pay === "only-one") {
      const donation = await db.query(
        'INSERT INTO public."donationOne"(id, user_id, email, organization_id, amount, ogrn) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [
          id,
          req.user.id,
          email,
          req.params.organizationId,
          amount,
          ogrn.rows[0].ogrn,
        ]
      );
      return res.status(200).json({
        success: false,
        donation: donation.rows[0],
      });
    } else if (time_pay === "every-month") {
      const countDonation = await db.query(
        'SELECT * FROM public."donationEveryMonth" WHERE user_id = $1 AND organization_id = $2 ',
        [req.user.id, req.params.organizationId]
      );
      if (!countDonation.rows.length) {
        const donation = await db.query(
          'INSERT INTO public."donationEveryMonth"(id, email, user_id, organization_id, status, amount, ogrn) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [
            id,
            email,
            req.user.id,
            req.params.organizationId,
            "Первая оплата",
            amount,
            ogrn.rows[0].ogrn,
          ]
        );
        await db.query(
          'INSERT INTO public."donationOne"(id, user_id, email, organization_id, amount, ogrn) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            id,
            req.user.id,
            email,
            req.params.organizationId,
            amount,
            ogrn.rows[0].ogrn,
          ]
        );
        return res.status(200).json({
          success: true,
          donation: donation.rows[0],
        });
      } else if (
        countDonation.rows[0].status === "Активна" ||
        countDonation.rows[0].status === "Первая оплата"
      ) {
        return res.status(400).json({
          success: false,
          message: "Подписка уже активна",
        });
      } else if (countDonation.rows[0].status === "Заморожена") {
        db.query(
          'UPDATE public."donationEveryMonth" SET status= $1 WHERE user_id = $2',
          ["Активна", req.user.id]
        );
        await db.query(
          'INSERT INTO public."donationOne"(id, user_id, email, organization_id, amount, ogrn) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            id,
            req.user.id,
            email,
            req.params.organizationId,
            amount,
            ogrn.rows[0].ogrn,
          ]
        );

        return res.status(200).json({
          success: true,
          message: "Подписка снова активна",
        });
      }
    }
  } catch (e) {
    console.log(e.message);

    return res.status(400).json({
      success: false,
      error: e.message,
    });
  }
};

exports.getDonationsOne = async (req, res) => {
  try {
    console.log(req.query);
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? "ASC" : "DESC";
    const sortParam = req.query.orderBy === "amount" ? "amount" : '"payDate"';

    let queryParams = [];
    let queryConditions = [];
    let paramIndex = 1;
    let realSum;
    let minusSum = 0;

    if (req.query.userId) {
      queryConditions.push(`user_id = $${paramIndex}`);
      queryParams.push(req.query.userId);
      paramIndex++;
    }

    if (req.query.organizationId) {
      queryConditions.push(`organization_id = $${paramIndex}`);
      queryParams.push(req.query.organizationId);
      paramIndex++;
      realSum = await db.query(
        `SELECT * FROM public."sumDonation" WHERE organization_id = $1`,
        [req.query.organizationId]
      );
    }

    if (req.query.ogrn) {
      queryConditions.push(`ogrn = $${paramIndex}`);
      queryParams.push(req.query.ogrn);
      paramIndex++;
      realSum = await db.query(
        `SELECT * FROM public."sumDonation" WHERE ogrn = $1`,
        [req.query.ogrn]
      );
      const minusSuma = await db.query(`SELECT SUM(sum) FROM public.reports WHERE organization_ogrn = $1`,[req.query.ogrn])
      if(minusSuma.rows[0].sum !== null){
        minusSum = minusSuma.rows[0].sum
      }
    }
    if (req.query.payDate) {
      queryConditions.push(`"payDate" = $${paramIndex}`);
      queryParams.push(req.query.payDate);
      paramIndex++;

    }

    const query = `
            SELECT * FROM "donationOne"  ${
              paramIndex !== 1 ? ` WHERE ${queryConditions.join(" AND ")}` : " "
            } ORDER BY ${sortParam} ${sortDirection} OFFSET $${paramIndex} LIMIT $${
      paramIndex + 1
    }`;
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const querySum = `SELECT SUM(amount) FROM "donationOne"  ${
      paramIndex !== 1 ? `WHERE ${queryConditions.join(" AND ")}` : " "
    }`;

    console.log(querySum);
    const queryCount = `SELECT COUNT(*) FROM "donationOne"  ${
      paramIndex !== 1 ? ` WHERE ${queryConditions.join(" AND ")}` : " "
    }`;

    const totalDonations = await db.query(queryCount, queryParams);

    const totalSumDonation = await db.query(querySum, queryParams);

    const lastMonthDonationsQuery = `SELECT COUNT(*) FROM "donationOne" WHERE "payDate" >= '${oneMonthAgo
      .toISOString()
      .replace("T", " ")
      .replace("0Z", "")}' ${
      paramIndex !== 1 ? ` AND ${queryConditions.join(" AND ")}` : " "
    }`;

    console.log(lastMonthDonationsQuery);

    const lastMonthDonations = await db.query(
      lastMonthDonationsQuery,
      queryParams
    );

    const lastSumDonationQuery = `SELECT SUM(amount) FROM "donationOne" WHERE "payDate" >= '${oneMonthAgo
      .toISOString()
      .replace("T", " ")
      .replace("0Z", "")}' ${
      paramIndex !== 1 ? ` AND ${queryConditions.join(" AND ")}` : " "
    }`;

    const lastSumDonation = await db.query(lastSumDonationQuery, queryParams);

    console.log(query);
    queryParams.push(startIndex, limit);

    const donations = await db.query(query, queryParams);

    console.log(minusSum)
    if (req.query.organizationId || req.query.ogrn) {
      return res.status(200).json({
        donations: donations.rows,
        countAllDonations: totalDonations.rows[0],
        countLastMonthDonations: lastMonthDonations.rows[0],
        totalSumDonation: totalSumDonation.rows[0],
        lastSumDonation: lastSumDonation.rows[0],
        realSum: realSum.rows[0].summa,
        minusSum: minusSum,
      });
    }
    return res.status(200).json({
      donations: donations.rows,
      countAllDonations: totalDonations.rows[0],
      countLastMonthDonations: lastMonthDonations.rows[0],
      totalSumDonation: totalSumDonation.rows[0],
      lastSumDonation: lastSumDonation.rows[0],
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.addReport = async (req, res) => {
  const id = CryptoJS.lib.WordArray.random(16).toString();

  const {sum, organization_ogrn, title} = req.body;
  console.log(sum)
  if(isNaN(sum)){
    return res.status(500).json({
      error: "В поле 'Сумма' должно быть число",
    });
  }
  try{
  await db.query(
    `INSERT INTO public.reports(
    id, organization_ogrn, sum, title)
    VALUES ($1, $2, $3, $4)`,
    [id, organization_ogrn, sum, title]
  );
  await db.query(
    'UPDATE public."sumDonation" SET summa = (summa - $1) WHERE ogrn = $2',
    [sum, organization_ogrn]
  );
  

  return res.status(200).json({
    success: true,
    message: "Отчет отправлен",
  });
}catch(e) {
  console.log(e.message);
    return res.status(500).json({
      error: e.message,
    });
}
};

exports.getRealSum = async (req, res) => {
  const sum = await db.query(
    `SELECT * FROM public."sumDonation" WHERE organization_id = $1`,
    []
  );
};

exports.getDonationsEveryMonth = async (req, res) => {
  try {
    console.log(req.query);
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? "ASC" : "DESC";
    const sortParam = req.query.orderBy === "amount" ? "amount" : '"payDate"';

    let queryParams = [];
    let queryConditions = [];
    let paramIndex = 1;

    if (req.query.userId) {
      queryConditions.push(`user_id = $${paramIndex}`);
      queryParams.push(req.query.userId);
      paramIndex++;
    }
    if (req.query.ogrn) {
      queryConditions.push(`ogrn = $${paramIndex}`);
      queryParams.push(req.query.ogrn);
      paramIndex++;
    }

    if (req.query.status) {
      queryConditions.push(`status = $${paramIndex}`);
      queryParams.push(req.query.status);
      paramIndex++;
    }

    if (req.query.organizationId) {
      queryConditions.push(`organization_id = $${paramIndex}`);
      queryParams.push(req.query.organizationId);
      paramIndex++;
    }
    if (req.query.payDate) {
      queryConditions.push(`"payDate" = $${paramIndex}`);
      queryParams.push(req.query.payDate);
      paramIndex++;
    }

    const query = `
              SELECT * FROM "donationEveryMonth"  ${
                paramIndex !== 1
                  ? ` WHERE ${queryConditions.join(" AND ")}`
                  : " "
              } ORDER BY ${sortParam} ${sortDirection} OFFSET $${paramIndex} LIMIT $${
      paramIndex + 1
    }`;

    console.log(query);
    queryParams.push(startIndex, limit);

    const donations = await db.query(query, queryParams);

    const totalDonations = await db.query(
      'SELECT COUNT(*) FROM "donationEveryMonth"'
    );

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthDonations = await db.query(
      'SELECT COUNT(*) FROM "donationEveryMonth" WHERE "payDate" >= $1',
      [oneMonthAgo]
    );

    return res.status(200).json({
      donations: donations.rows,
      countAllDonations: totalDonations.rows[0],
      countLastMonthDonations: lastMonthDonations.rows[0],
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
