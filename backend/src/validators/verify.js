const { check } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.verifyToken = check('token').custom(async (value, { req }) =>{
    if(!value) {
        throw new Error('Unauthorized');
    }

    jwt.verify(value, process.env.SECRET, (err, user) =>{
        if(err) {
            throw new Error('Unauthorized');
        }
        req.user = user;
    });
});

exports.verifyTokenPersnOrg = check('token').custom(async (value, { req }) =>{
    if(!value) {
        throw new Error('Unauthorized');
    }

    jwt.verify(value, process.env.SECRET, (err, persnOrg) =>{
        if(err) {
            throw new Error('Unauthorized');
        }
        req.persnOrg = persnOrg;
    });
});