const express = require('express');
const PostController = require('../controller/post.controller');
const authMiddleware = require('../middleware/auth.middleware');
const checkRole= require('../middleware/checkRole.middleware');

var router = express.Router();
router.route('/')
    .get(PostController.getAllView);
router.route('/manager')
    .get(authMiddleware.authenicate, PostController.index)
router.route('/create')
    .get(authMiddleware.authenicate, PostController.createView)
    .post(authMiddleware.authenicate, PostController.posting)
router.route('/search/:id')
    .get(PostController.getPostById)
router.route('/edit/:id')
    .post(PostController.editPostById)
router.route('/api/:id')
    .get(PostController.getPostApi)
router.route('/update/:id')
    .post(PostController.updateView);
router.route('/remove/:id')
    .get(PostController.removePostView)
module.exports = router