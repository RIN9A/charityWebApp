const { Router } = require('express');
const { verifyToken } = require('../validators/verify');
const router = Router();
const { validationMiddleware } = require('../middlewares/validations.middleware');
const { isAdmin } = require('../validators/dopParam');

const { getprojects } = require( "../controllers/projects.controller");


router.get('/getprojects', validationMiddleware ,getprojects)

module.exports = router 