const express = require('express');
const { generateImage } = require('../controllers/openaiController');
const router = express.Router();

router.post('/method1', generateImage);

module.exports = router;
