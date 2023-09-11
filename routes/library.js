const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const libraryController = require("../controllers/libraryController.js");


router.get('/get', libraryController.getLibrary);//library route





module.exports = router;
