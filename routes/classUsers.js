const express = require("express");
const { body } = require("express-validator");
const classUserController = require("../controllers/classUsersController");
const router = express.Router();

router.post("/", classUserController.getClassUsers); //userinfo route

module.exports = router;
