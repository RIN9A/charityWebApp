const { Router } = require('express');
const { validationMiddleware } = require('../middlewares/validations.middleware');
const { verifyToken } = require('../validators/verify');
const { addDonation, getDonationsOne, getDonationsEveryMonth } = require('../controllers/donation.controller');

const router = Router();


router.post('/addDonation/:organizationId',verifyToken, validationMiddleware, addDonation);
router.get('/getDonationsOne', verifyToken, validationMiddleware, getDonationsOne)
router.get('/getSubscriptions', verifyToken, validationMiddleware, getDonationsEveryMonth)
module.exports = router 