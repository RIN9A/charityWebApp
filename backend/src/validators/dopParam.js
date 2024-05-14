const { body, check ,param } = require('express-validator')


exports.isAdmin = check('isAdmin').custom(async (value, {req})=>{
    if(!req.user.isAdmin) {
        throw new Error('Не достаточно прав для действия')        
    }
}) 

exports.isPersnOrg = check('isPersnOrg').custom(async (value, {req})=>{
    if(!req.user.isPersnOrg) {
        throw new Error('Не достаточно прав для действия')        
    }
}) 