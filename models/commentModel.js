const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let commentSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderNameEn:{
      type: String
    },
    senderNameZh:{
      type: String
    },
    senderHeadImg:{
      type: String
    },
    senderUserId:{
      type: String
    },
    message: {
      type: String,
    },
    roomId:{
      type: Schema.Types.ObjectId,
      ref:'Room'
    },
    read: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

commentSchema.virtual("sender", {
  ref: "User", //The Model to use
  localField: "senderId", //Find in Model, where localField
  foreignField: "_id", // is equal to foreignField
});

commentSchema.set("toObject", { virtuals: true });
commentSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Comments", commentSchema);
