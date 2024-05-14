const { check } = require("express-validator");
const db = require("../db");
const { compare } = require("bcryptjs");
const password = check("password")
  .isLength({ min: 6 })
  .withMessage("Длина пороля должна быть не менее, чем 6 символов.");
const email = check("email")
  .isEmail()
  .withMessage("Введен некорректный адрес электроной почты.");
const emailExists = check("email").custom(async (value) => {
  const { rows } = await db.query("SELECT * from users WHERE email = $1", [
    value,
  ]);

  if (rows.length) {
    throw new Error("Введенный адрес электроной почты уже зарегистрирован.");
  }
});
const loginFieldCheck = check("email").custom(async (value, { req }) => {
  const user = await db.query(
    'SELECT * from public."usersLogin" WHERE email = $1',
    [value]
  );
  if (!user.rows.length) {
    throw new Error("Введенный адрес электронной почты не зарегистрирован.");
  }
  const validPassword = await compare(req.body.password, user.rows[0].password);
  console.log(user.rows[0].password);
  if (!validPassword) {
    throw new Error("Неверный пароль.");
  }
  req.user = user.rows[0];
});
module.exports = {
  registerValidation: [email, password, emailExists],
  loginValidation: [loginFieldCheck],
};
