const express = require('express');
const grwthxController = require("../controllers/grwthxController");
const router = express.Router();


router.get('/getInfo', grwthxController.getInfo);
router.put('/updateStatus', grwthxController.updateStatus);


module.exports = router;