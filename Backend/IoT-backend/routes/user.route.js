const express = require('express');
const UserController = require('../controller/user.controller');
var router = express.Router();
const checkRoleMiddleware = require('../middleware/checkRole.middleware');
const Role = require('../models/Role');
const User = require('../models/User');

router.route('/')
    .get(UserController.getAll);
router.route('/create')
    .post(checkRoleMiddleware.checkRole, UserController.create, (req, res) => {
        return res.redirect('/user/manager')
    });
router.route('/manager')
    .get(checkRoleMiddleware.checkRole, UserController.userManagerView);

router.route('/api/delete')
    .get(checkRoleMiddleware.checkRole, UserController.deleteUser, (req, res) => {
        return res.redirect('/user/manager');
    })
router.route('/search/:id')
    .get(UserController.getRoleById);

module.exports = router