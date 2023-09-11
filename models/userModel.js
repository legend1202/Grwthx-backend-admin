const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    headImg: {
      type: String,
    },
    nameEn: {
      type: String,
    },
    nameZh: {
      type: String,
    },
    userId: {
      type: String,
    },
    role: {
      type: String,
    },
    mark:{
      type: String
    },
    createdByAssignment: {
      type: Boolean,
    },
    createdByShared: {
      type: Boolean,
    },
    status:{
      type: String
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
    assignmentId: {
      type: Schema.Types.ObjectId || null,
      ref: "Assignment",
    },
    isFavorite: {
      type: Boolean || null
    }
  },
  { timestamps: true }
);

userSchema.virtual("room", {
  ref: "Room", //The Model to use
  localField: "roomId", //Find in Model, where localField
  foreignField: "_id", // is equal to foreignField
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", userSchema);
