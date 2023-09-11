const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let classSchema = new Schema(
  {
    classId: {
      type: String,
    },
    className: {
      type: String,
    },
    schoolId: {
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

module.exports = mongoose.model("Class", classSchema);
