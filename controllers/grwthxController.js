const AssignmentSchema = require("../models/assignmentsModel");
const GroupSchema = require("../models/groupSchema");
const RoomSchema = require("../models/roomModel");
const UserSchema = require("../models/userModel");
const dayjs = require("dayjs");

exports.getInfo = async (req, res, next) => {
    const { assignmentId, roomId, userId } = req.query;
    if(assignmentId && (assignmentId !== 'undefined')) {
      AssignmentSchema.find({ _id: assignmentId })
        .then((docs) => {
          const assignment = docs[0];
          RoomSchema.find({ roomId: roomId })
            .then((docs) => {
              const room = docs[0];
              UserSchema.find({ userId: userId, roomId: room._id })
                .then((docs) => {
                  const user = docs[0];
                  console.log(userId,'--', room._id)
                  res.json({
                    assignment,
                    room,
                    user: user,
                  });
                })
                .catch((err) => {
                  res.status(500).json({ error: err.message,  root:'can not find user'  });
                });
            })
            .catch((err) => {
              res.status(500).json({ error: err.message,  root:'can not find room'  });
            });
        })
        .catch((err) => {
          res.status(500).json({ error: err.message, root:'can not find assingment' });
        });
    } else {
      RoomSchema.find({ roomId: roomId })
        .then((docs) => {
          const room = docs[0];
          UserSchema.find({ userId: userId, roomId: room._id })
            .then((docs) => {
              const user = docs[0];
              res.json({
                room,
                user: user,
              });
            })
            .catch((err) => {
              res.status(500).json({ error: err.message });
            });
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    }
};

exports.updateStatus = async (req, res, next) => {
  const { roomId, assignmentId } = req.body;
  let status = "";
  AssignmentSchema.find({ _id: assignmentId }).then((docs) => {
    if (dayjs(docs[0].dueDate) >= dayjs()) {
      status = "Submitted";
    } else {
      status = "Done late";
    }

    RoomSchema.find({ roomId: roomId })
      .then(async (docs) => {
        const filter = { roomId: docs[0]._id };
        const update = {
          status,
        };
        console.log(filter);

        let assignment = await AssignmentSchema.updateMany(
          { _id: assignmentId },
          update
        );
        let room = await RoomSchema.updateMany({ roomId }, update);
        let user = await UserSchema.updateMany(filter, update);
        let group = await GroupSchema.findOneAndUpdate(filter, update);
        user = await UserSchema.findOne(filter);
        group = await GroupSchema.findOne(filter);
        assignment = await AssignmentSchema.findOne({ _id: assignmentId });
        room = await RoomSchema.findOne({ roomId });
        res.json({ result: "Updated Successfully." });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
};