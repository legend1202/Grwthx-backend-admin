const axios = require("axios");
const UserSchema = require("../models/userModel.js");
const GroupSchema = require("../models/groupSchema.js");
const RoomSchema = require("../models/roomModel.js");
const { AUTHORISATION_TOKEN_STORAGE_KEY, AUTHORISATION_USER_ID_STORAGE_KEY, AUTHORISATION_USER_NAME_STORAGE_KEY, AUTHORISATION_USER_NAME_ZH_STORAGE_KEY, AUTHORISATION_USER_HEAD_IMAGE_KEY } = require("../utils/constants.js");

exports.deleteUserByRoomId = async (req, res, next) => {
  const deleteUsersQuery = await UserSchema.deleteMany({
    roomId: req.body.roomId,
  });

  const deleteGroupQuery = await GroupSchema.deleteMany({
    roomId: req.body.roomId,
  });

  const deleteRoomQuery = await RoomSchema.findByIdAndRemove(req.body.roomId);

  Promise.all([deleteUsersQuery, deleteGroupQuery, deleteRoomQuery])
    .then((results) => {
      console.log(results);
      res.json({
        result: `${req.body.roomId} has been deleted successfully.`,
      });
    })
    .catch((error) => {
      if (error) {
        res.status(404).json({ error: error.message });

        throw error;
      }
    });
};

exports.setMark = async (req, res, next) => {
  try {
    const { studentId, roomId, mark } = req.body;
    let user = await UserSchema.findById(studentId).exec();
    if (user) {
      let filteredUser = await UserSchema.findOneAndUpdate(
        { _id: studentId },
        { mark }
      );

      filteredUser = await UserSchema.findOne({ _id: studentId }).exec();
      console.log(filteredUser);
      res.json(filteredUser);
    } else {
      const users = await UserSchema.find({ roomId: roomId }).exec();

      let filteredGroup = await GroupSchema.findOneAndUpdate(
        { _id: studentId },
        { mark }
      );

      users.map(async (user) => {
        filteredGroup = await GroupSchema.findOne({
          _id: user?.groupId,
        }).exec();

        let filteredUser = await UserSchema.findOneAndUpdate(
          { _id: user._id },
          { mark }
        );

        filteredUser = await UserSchema.find({ _id: user._id }).exec();
        console.log(filteredUser);
      });

      res.json(filteredUser);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


