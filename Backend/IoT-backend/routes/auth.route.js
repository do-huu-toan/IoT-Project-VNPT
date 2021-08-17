const authController = require('../controller/auth.controller')

const cors = require('cors');
const corsOption = {
  origin: '*'
}

const express = require('express')
var router = express.Router()

router.route('/login')
    .post(authController.auth)
router.route('/api/login')
    .post(cors(corsOption) ,authController.authApi)
module.exports = router;