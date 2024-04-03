const express = require('express');
const router = express.Router();

// parent
var controller = require('../controllers/controller');

router.route('/glogin')
.get(controller.glogin);

router.route('/auth_callback')
.get(controller.auth_callback);

router.route('/library')
.get(controller.library);

router.route('/save_page')
.post(controller.save_page);

router.route('/favorite')
.post(controller.favorite);

router.route('/contact_us')
.post(controller.contact_us);

module.exports = router;