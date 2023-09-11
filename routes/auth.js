const express = require('express');
const { body } = require('express-validator');
const authController = require("../controllers/auth");
const uploadImage = require('../middleware/upload-image');
const router = express.Router();


router.get('/getAccessToken/', authController.get_accesstoken);//access_token route
router.post("/logout", authController.logout);
router.post("/getTotalInfo", authController.getTotalInfo);


module.exports = router;