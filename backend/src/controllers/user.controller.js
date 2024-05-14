const db = require("../db");
const { hashSync } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants/index");

exports.updateUser = async (req, res) => {
  if (req.body.password) {
    try {
      const user = await db.query(
        'SELECT * from public."usersLogin" WHERE id = $1',
        [req.params.userId]
      );

      const payload = {
        id: user.rows[0].id,
        email: user.rows[0].email,
        isAdmin: user.rows[0].isAdmin,
        isPersnOrg: user.rows[0].isPersnOrg,
      };

      return res.status(200).json({
        success: true,
        message: "Изменения выполнены успешно",
        user: payload,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({
        error: error.message,
      });
    }
  } else {
    return res.status(200).json({
      success: true,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await db.query('DELETE FROM "usersLogin" WHERE id = $1;', [
      req.params.userId,
    ]);
    return res.status(200).json("Аккаун удален");
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
