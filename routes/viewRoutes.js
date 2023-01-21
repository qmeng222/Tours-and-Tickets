const express = require('express');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/', viewsController.getOverview);
router.get('/tour/:slug', viewsController.getTour);
router.get('/signup', viewsController.getSignupForm);
router.get('/login', viewsController.getLoginForm);

module.exports = router;
