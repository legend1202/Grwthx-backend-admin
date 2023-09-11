const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let groupSchema = new Schema(
  {
    groupName: {
      type: String,
    },
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
    },
    status: {
      type: String,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    mark: {
      type: String,
    },
  },
  { timestamps: true }
);

groupSchema.virtual("members", {
  ref: "User", //The Model to use
  localField: "_id", //Find in Model, where localField
  foreignField: "groupId", // is equal to foreignField
});

groupSchema.virtual("room", {
  ref: "Room", //The Model to use
  localField: "roomId", //Find in Model, where localField
  foreignField: "_id", // is equal to foreignField
});

groupSchema.set("toObject", { virtuals: true });
groupSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Group", groupSchema);
