const express = require('express');
const RoleController = require('../controller/role.controller');

var router = express.Router();
router.route('/')
    .get(RoleController.getAll);
router.route('/create')
    .post(RoleController.create)
module.exports = router