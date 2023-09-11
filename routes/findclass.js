const express = require('express');
const { body } = require('express-validator');

const findclassController = require("../controllers/findclassController");
const router = express.Router();


router.get('/findClass', findclassController.get_class);//get class information route
router.get('/findSubjects', findclassController.get_subject);//get subject information route
router.get('/getClassOriginal', findclassController.get_class_original);
router.get('/getSubjectsOriginal', findclassController.get_subject_original);



module.exports = router;