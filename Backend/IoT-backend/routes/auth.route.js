const authController = require('../controller/auth.controller')

const express = require('express')
var router = express.Router()
const CorsMiddleware = require('../middleware/cors.middleware')

router.route('/login')
    .post(authController.auth)
router.route('/api/login')
    .post( CorsMiddleware.api ,authController.authApi)

module.exports = router;