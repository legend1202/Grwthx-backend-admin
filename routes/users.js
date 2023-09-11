const express = require("express");
const usersController = require("../controllers/usersController");
const router = express.Router();

router.delete("/deleteUserByRoomId", usersController.deleteUserByRoomId);
router.put("/setMark", usersController.setMark);

module.exports = router;
