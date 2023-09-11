const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let subjectSchema = new Schema(
  {
    className: {
      type: String,
    },
    shortName: {
      type: String,
    },
    subjectId: {
      type: String,
    },
    shortName: {
      type: String,
    },
    assignmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);
