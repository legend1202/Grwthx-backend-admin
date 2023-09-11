const axios = require("axios");
const CommentSchema = require("../models/commentModel.js");

exports.createComment = async (req, res, next) => {
  try {
    const insertComment = new CommentSchema({
      message: req.body.message,
      senderId: req.body.senderId,
      roomId: req.body.roomId,
      read: false,
    });
    await insertComment.save();
    res.json({ result: `${insertComment.id} comment created` });
  } catch (error) {
    console.log('=======>>comment create Error', error.message)
    res.status(500).json({ error: error.message});
  }
};

exports.getCommentsByRoomId = async (req, res, next) => {
  CommentSchema.find({
    roomId: req.query.roomId,
  })
    .populate({ path: "sender" })
    .sort({ createdAt: 1 })
    .then((docs) => {
      res.json(docs);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};
