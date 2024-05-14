const { Router } = require('express');
const { validationMiddleware } = require('../middlewares/validations.middleware');
const { verifyToken } = require('../validators/verify');
const { orgnPost } = require('../controllers/orgnPost.controller')
const router = Router();




