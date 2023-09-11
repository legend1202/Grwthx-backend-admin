const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let roomModel = new Schema(
  {
    roomId: {
      type: String,
    },
    startobj:{
      type: String,
    },
    assignmentId: {
      type: Schema.Types.ObjectId || null,
      ref: "Assignment",
    },
    title: {
      type: String,
    },
    status: {
      type: String,
    },
    storagePath: {
      type: String,
    },
    headImg:{
      type:String
    }
  },
  { timestamps: true }
);

roomModel.virtual("sharingUsers", {
  ref: "User", //The Model to use
  localField: "_id", //Find in Model, where localField
  foreignField: "roomId", // is equal to foreignField
});

roomModel.virtual("group", {
  ref: "Group", //The Model to use
  localField: "_id", //Find in Model, where localField
  foreignField: "roomId", // is equal to foreignField
});

roomModel.set("toObject", { virtuals: true });
roomModel.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Room", roomModel);
