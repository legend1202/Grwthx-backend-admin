const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define collection and schema for Library
let AssignmentSchema = new Schema(
  {
    title: {
      type: String,
    },
    grade: {
      type: String,
    },
    dueDate: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

AssignmentSchema.virtual("rooms", {
  ref: "Room", //The Model to use
  localField: "_id", //Find in Model, where localField
  foreignField: "assignmentId", // is equal to foreignField
});

AssignmentSchema.virtual("subject", {
  ref: "Subject", //The Model to use
  localField: "_id", //Find in Model, where localField
  foreignField: "assignmentId", // is equal to foreignField
});

AssignmentSchema.virtual("class", {
  ref: "Class", //The Model to use
  localField: "_id", //Find in Model, where localField
  foreignField: "assignmentId", // is equal to foreignField
});

AssignmentSchema.virtual("students", {
  ref: "User", //The Model to use
  localField: "_id", //Find in Model, where localField
  foreignField: "assignmentId", // is equal to foreignField
});

AssignmentSchema.virtual("groups", {
  ref: "Group", //The Model to use
  localField: "_id", //Find in Model, where localField
  foreignField: "assignmentId", // is equal to foreignField
});

AssignmentSchema.set("toObject", { virtuals: true });
AssignmentSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Assignment", AssignmentSchema);
