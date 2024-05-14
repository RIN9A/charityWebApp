const { body, check ,param } = require('express-validator')

exports.compareId = param('userId').custom(async (value, { req }) => {
    if(value !== req.user.id) {
        throw new Error('Wrong!!!')
    }
})