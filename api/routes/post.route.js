const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

const controller = require('../controllers/post.controller');

router.post('/', upload.single('image'), controller.uploadPost);

router.post('/:idPost/like', controller.postLike);

router.post('/:idPost/comment', controller.postComment);

module.exports = router;
