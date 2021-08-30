const express = require('express');
const DeviceController = require('../controller/device.controller')

var router = express.Router();
router.route('/')
    .get(DeviceController.index);
router.route('/create')
    .post(DeviceController.create);
router.route('/api')
    .get(DeviceController.getAllDevice)
module.exports = router