const { check, body } = require('express-validator')
const db = require('../db')
const { compare } = require("bcryptjs")

const title = check('title').custom(async (value)  => {
    if(!value) {
        throw new Error('Пожалуйста, напишите заголовок поста')
    }
    
});

const content = check('content').custom(async (value)  => {
    if(!value) {
        throw new Error('Пожалуйста, заполните тело поста')
    }
    
});


module.exports = {
    postValidation:[title, content],
}                                                   