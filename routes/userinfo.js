const express = require('express');
const { body } = require('express-validator');
const authController = require("../controllers/auth");
const uploadImage = require('../middleware/upload-image');
const router = express.Router();


router.get('/', authController.get_userinfo);//Userinfo route
router.get('/byToken', authController.getUserInfoByToken)


module.exports = router;