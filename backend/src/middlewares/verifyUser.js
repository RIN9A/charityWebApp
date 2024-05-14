import jwt from 'jsonwebtoken'

exports.verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) { 
        return next()
    }
    jwt.verify(token, process.env.SECRET,)

};
