const express = require('express');
const { body } = require('express-validator');
const assignmentsController = require("../controllers/assignmentsController");

const router = express.Router();

router.post('/insert', assignmentsController.insertAssignment);//insert
router.get('/getdata', assignmentsController.getAssignments);//getdata
router.post('/getusers', assignmentsController.assignment_getusers);//getusers
router.post('/getsubmitted', assignmentsController.assignment_getsubmittednumber);//submit
router.delete('/rowdelete', assignmentsController.individual_delete);//delete
router.delete('/deleteById', assignmentsController.deleteAssignment);//delete row one data in the students page
router.post('/markvalueupdate', assignmentsController.markvalueupdate);//update mark value data in the students page
router.post('/updatebytitle', assignmentsController.assignment_updatebytitle);//update assignmentsdata by class,subject in the Assignments page // In other ways, assignmentsdata edit
router.get('/getAssignmentById', assignmentsController.getAssignmentById);
router.put('/update', assignmentsController.updateAssignment);


module.exports = router;