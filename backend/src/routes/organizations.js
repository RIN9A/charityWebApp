const { Router } = require('express');
const { validationMiddleware } = require('../middlewares/validations.middleware');
const { verifyTokenPersnOrg, verifyToken } = require('../validators/verify');
const { isAdmin, isPersnOrg } = require('../validators/dopParam');
const {registOrganization, loginValidation } = require('../validators/organization')
const {registerPersonOrganization} = require('../controllers/personOrganization.controller')
const {registerOrganization, getOrganizations, deleteOrganizaton, updateOrganization, updatePersonOrganization} = require('../controllers/organization.controller');
const { createPost, createProjectEvent} = require('../controllers/orgnPost.controller');
const { organizationPasswordUpdate } = require('../validators/update');
const { getposts,updatepost } = require('../controllers/orgnPost.controller');
const { addReport } = require('../controllers/donation.controller');
const { getFuz } = require('../controllers/fuzz');



const router = Router();

router.post('/addOrganization',verifyToken, isAdmin, registOrganization, validationMiddleware, registerPersonOrganization ,registerOrganization);
router.get('/getOrganizations', validationMiddleware, getOrganizations)
router.delete('/delete/:organizationId', verifyToken, deleteOrganizaton)
router.post('/create-post/:organizationOGRN', verifyToken, isPersnOrg,validationMiddleware,createPost);
router.post('/create-project-event/:organizationOGRN', verifyToken, isPersnOrg, validationMiddleware, )
router.put('/update-post/:postId/:ogrn',verifyToken, isPersnOrg,validationMiddleware ,updatepost)
router.put('/update-post/:postId', verifyToken, isAdmin, validationMiddleware, updatepost)
router.put('/changePass/:organizationId', verifyToken, isAdmin, organizationPasswordUpdate, validationMiddleware, updatePersonOrganization)
router.get('/post/getposts', verifyToken,isPersnOrg,validationMiddleware ,getposts)
router.post('/addReport', verifyToken, isPersnOrg, validationMiddleware, addReport);
router.get('/expert', getFuz)

module.exports = router