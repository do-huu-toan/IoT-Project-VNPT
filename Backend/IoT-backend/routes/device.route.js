const express = require('express');
const DeviceController = require('../controller/device.controller')

var router = express.Router();
router.route('/')
    .get(DeviceController.index);
router.route('/create')
    .post(DeviceController.create);
module.exports = router