const db = require("../db");
const { hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants/index");
const CryptoJS = require("crypto-js");

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query("select * from users");

    return res.status(200).json({
      success: true,
      users: rows,
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const id = CryptoJS.lib.WordArray.random(16).toString();

  try {
    const hashedPassword = await hash(password, 10);

    const user = await db.query(
      "insert into users(id, email, password) values ($1, $2, $3) RETURNING *",
      [id, email, hashedPassword]
    );
    console.log(user.rows[0]);
    await db.query(
      'insert into public."usersLogin"(id, email,"isAdmin", "isPersnOrg", password) values ($1, $2, $3, $4, $5)',
      [id, email, false, false, hashedPassword]
    );

    return res.status(201).json({
      success: true,
      message: "Регистрация прошла успешно",
    });
  } catch (error) {
    console.log(`${error.message} error auth.js str 36`);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const user = req.user;

  const payload = {
    id: user.id,
    email: user.email,
    isAdmin: user.isAdmin,
    isPersnOrg: user.isPersnOrg,
  };
  try {
    const token = await sign(payload, SECRET);
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
      })
      .json({
        success: true,
        message: "Вход выполнен успешно",
        user: payload,
      });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.protected = async (req, res) => {
  try {
    return res.status(200).json({
      info: "protected info",
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.logout = async (req, res) => {
  try {
    return res.status(200).clearCookie("token", {}).json({
      success: true,
      message: "Вывход выполнен успешно.",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
