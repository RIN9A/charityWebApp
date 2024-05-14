
const {postValidation} = require('../validators/post')
const {create} = require('../controllers/post.controller')
const { Router } = require('express');
const { verifyToken } = require('../validators/verify');
const router = Router();
const { validationMiddleware } = require('../middlewares/validations.middleware');
const { isAdmin } = require('../validators/dopParam');
const {getposts} = require('../controllers/post.controller')
const {deletepost}  = require('../controllers/post.controller')
const {updatepost}  = require('../controllers/post.controller')
const {compareId} = require('../validators/deleteUser')




router.post('/create',verifyToken, isAdmin, postValidation, validationMiddleware, create);
router.get('/getposts', validationMiddleware ,getposts)
router.delete('/deletepost/:postId/:userId', verifyToken, isAdmin, compareId,deletepost)
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)
router.get('/posts',  validationMiddleware, getposts)


module.exports = router