const express = require('express');
const roomController = require("../controllers/roomController");
const router = express.Router();


router.get('/get', roomController.getRooms);
router.get('/getById', roomController.getRoomById);
router.post('/create', roomController.createRoom);
router.put('/toggleFavorite', roomController.toggleFavorite);
router.put('/updateTitle', roomController.updateTitle);
router.delete('/deleteById', roomController.deleteById);



module.exports = router;