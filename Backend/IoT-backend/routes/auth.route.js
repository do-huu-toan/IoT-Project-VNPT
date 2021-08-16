const authController = require('../controller/auth.controller')

const express = require('express')
var router = express.Router()

router.route('/login')
    .post(authController.auth)
router.route('/api/login')
    .post(authController.authApi)
module.exports = router;