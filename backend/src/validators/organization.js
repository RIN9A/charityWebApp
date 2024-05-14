const { check } = require('express-validator')
const db = require('../db')
const { compare } = require("bcryptjs")

const email = check('email')
    .isEmail()
    .withMessage('Введен некорректный адрес электроной почты.')

const emailExists = check('email').custom(async (value) => {
    const emailsUser  = await db.query('SELECT * from users WHERE email = $1', [
            value,
        ])
    const emailPersnOrg  = await db.query('SELECT * from "personOrgnz" WHERE email = $1', [value])
    
        if(emailsUser.rows.length || emailPersnOrg.rows.length) {
            throw new Error('Введенный адрес электроной почты уже зарегистрирован.')
        }
    })



    module.exports = {
        registOrganization: [email, emailExists],
    }