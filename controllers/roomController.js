const axios = require("axios");
const UserSchema = require("../models/userModel.js");
const _ = require("lodash");
const RoomSchema = require("../models/roomModel.js");
const {
  getUserInfoFromToken,
  makeId,
  removeDuplicatedElement,
} = require("../utils/helpers.js");
const {
  AUTHORISATION_TOKEN_STORAGE_KEY,
  AUTHORISATION_USER_ID_STORAGE_KEY,
} = require("../utils/constants.js");

exports.getRooms = async (req, res, next) => {
  const users = await UserSchema.find({ userId: req.query.userId });

  let roomIds = [];
  users.map((user) => {
    if (user?.roomId) {
      roomIds.push(user.roomId.toString());
    }
  });
  const array = _.uniq(roomIds);
  RoomSchema.find({ _id: { $in: array } })
    .populate({ path: "sharingUsers group" })
    .sort({ createdAt: -1 })
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

exports.getRoomById = async (req, res, next) => {
  RoomSchema.find({ _id: req.query.roomId })
    .populate({ path: "sharingUsers group" })
    .sort({ dueDate: 1 })
    .then((docs) => {
      res.json(docs[0]);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

exports.createRoom = async (req, res, next) => {
  try {
    const userInfo = await getUserInfoFromToken(
      req.cookies[AUTHORISATION_TOKEN_STORAGE_KEY]
    );

    if (!userInfo) {
      res.status(401).json({ error: "Your token is invalid" });
    } else {
      let startobj;
      let headImg;
      const roomId = makeId(30);
      if (req.body.object) {
        startobj = req.body.objectId;
        headImg = req.body.headImg;
      }

      const room = new RoomSchema({
        roomId: roomId,
        startobj:startobj,
        assignmentId: null,
        title: "Room-" + makeId(5),
        status: "New",
        headImg: headImg,
        storagePath: "https://play.grwth.hk/?roomId=",
      });

      const createUser = new UserSchema({
        headImg: userInfo.headImg,
        nameEn: userInfo.nameEn,
        nameZh: userInfo.nameZh,
        userId: userInfo.userId,
        createdByAssignment: false,
        createdByShared: false,
        status: "New",
        role: "Teacher",
        roomId: room.id,
        assignmentId: null,
        isFavorite: false,
      });

      await room.save();
      await createUser.save();
      res.json(room);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleFavorite = async (req, res, next) => {
  try {
    const filter = {
      roomId: req.body.roomId,
      userId: req.cookies[AUTHORISATION_USER_ID_STORAGE_KEY],
    };
    const update = {
      isFavorite: req.body.favorite,
    };
    let doc = await UserSchema.findOneAndUpdate(filter, update);

    doc = await UserSchema.findOne(filter);

    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTitle = async (req, res, next) => {
  const { assignmentId, roomId, userId, title } = req.body;
  if(!!!assignmentId){
    const result = await RoomSchema.findOneAndUpdate({roomId}, {title});
    res.json(result);

  }else{
    // const result = await RoomSchema.findOneAndUpdate({roomId, assignmentId}, {title});
    // console.log(result);
    // res.json(result);
  }
};

exports.deleteById = async (req, res, next) => {
  try {
    const roomId = req.body.roomId;

    const userFilter = {
      roomId,
    };

    const roomFilter = {
      _id: roomId,
    };

    const userDeletQuery = await UserSchema.deleteMany(userFilter);

    const roomDeleteQuery = await RoomSchema.deleteOne(roomFilter);

    Promise.all([userDeletQuery, roomDeleteQuery])
      .then((results) => {
        const userDeleteResult = results[0];
        const roomDeleteResult = results[1];

        console.log(userDeleteResult, roomDeleteResult);
        res.json({ result: `${roomId} was successfully deleted.` });
      })
      .catch((err) => {
        console.log(err.message);
        res.status(500).json({ error: err.message });
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
