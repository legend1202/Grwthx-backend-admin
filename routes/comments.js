const express = require('express');
const commentsController = require("../controllers/commentsController");
const router = express.Router();


router.get('/getByRoomId', commentsController.getCommentsByRoomId);
router.post('/create', commentsController.createComment);



module.exports = router;