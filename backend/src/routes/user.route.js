const { Router } = require('express');
const { updateUser } = require('../controllers/user.controller');
const { deleteUser } = require('../controllers/user.controller');
const { logout } = require('../controllers/auth');

const router = Router();
const { validationMiddleware } = require('../middlewares/validations.middleware');
const {usernameUpdateValidation} = require('../validators/update')
const { verifyToken } = require('../validators/verify');


router.put('/update/:userId', verifyToken, usernameUpdateValidation,validationMiddleware, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', logout);
//router.get('/getusers', verifyToken, getUsers)

module.exports = router 