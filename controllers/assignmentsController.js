const AssignmentSchema = require("../models/assignmentsModel.js");
const Mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;
const axios = require("axios");
const {
  getUserInfoFromToken,
  makeId,
  removeDuplicatedElement,
} = require("../utils/helpers.js");
const SubjectSchema = require("../models/subjectModel.js");
const ClassSchema = require("../models/classModel.js");
const RoomSchema = require("../models/roomModel.js");
const UserSchema = require("../models/userModel.js");
const GroupSchema = require("../models/groupSchema.js");
const _ = require("lodash");
const { AUTHORISATION_TOKEN_STORAGE_KEY } = require("../utils/constants.js");

exports.assignment_updatebytitle = (req, res) => {
  //update assignmentsdata value by class,subject in assignments page

  Assignments.updateMany(
    { $and: [{ class: req.body.classinfo }, { subject: req.body.subject }] },
    {
      $set: {
        title: req.body.title,
        duedate: req.body.duedate,
        gradeormark: req.body.grade,
      },
    },
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result.data);
      }
    }
  );
};

exports.markvalueupdate = (req, res) => {
  //update grademark value in the students list page

  const setvalue = req.body.updatevalue; // set updatevalue in Student page mark value.
  AssignmentSchema.updateOne(
    { _id: req.body.id },
    { $set: { gradeormark: setvalue } },
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result.data);
      }
    }
  );
};

function validateObjectId(id) {
  if (ObjectId.isValid(id)) {
    const obj = new ObjectId(id);
    if (obj == id) {
      return true;
    }
  }
  return false;
}

exports.individual_delete = async (req, res, next) => {
  // AssignmentSchema delete func

  AssignmentSchema.deleteOne(
    { _id: ObjectId(req.body.id) },
    function (err, result) {
      console.log(err);
      console.log(result);
      if (err) throw err;

      res.json(result.data);
    }
  );
};

exports.assignment_getusers = async (req, res, next) => {
  //get userinfo in studentslist page by assignment title

  AssignmentSchema.find({ title: req.body.rowtitle }, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
};

exports.assignment_getsubmittednumber = async (req, res, next) => {
  //get count new and submit status

  AssignmentSchema.aggregate(
    [
      { $match: { title: req.body.rowtitle } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ],
    function (err, result) {
      if (err) throw err;
      res.json(result);
    }
  );
};

exports.get_subject = async (req, res, next) => {
  //get subject information using authorization
  const url = "https://uatgrwth.app360.cn/grwth-as/api/findSubjects";
  const config = {
    method: "post",
    url: url,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      withCredentials: true,
      Authorization: req.body.Authorization,
    },
  };

  axios(config)
    .then(function (response) {
      const subjectDataArr = [];
      response.data.forEach((onesubject) => {
        subjectDataArr.push(onesubject.shortName);
      });
      res.json(subjectDataArr);
    })
    .catch(function (error) {});
};

exports.insertAssignment = async (req, res, next) => {
  const userInfo = await getUserInfoFromToken(
    req.cookies[AUTHORISATION_TOKEN_STORAGE_KEY]
  );
  if (userInfo) {
    try {
      const assignment = new AssignmentSchema({
        title: req.body.title,
        grade: req.body.grade,
        dueDate: req.body.dueDate,
        status: "New",
      });

      const subject = new SubjectSchema({
        className: req.body.subject.className,
        shortName: req.body.subject.shortName,
        subjectId: req.body.subject.subjectId,
        shortName: req.body.subject.shortName,
        assignmentId: assignment.id,
      });

      const classObject = new ClassSchema({
        classId: req.body.class.classId,
        className: req.body.class.className,
        schoolId: req.body.class.schoolId,
        shortName: req.body.class.shortName,
        assignmentId: assignment.id,
      });

      if (req.body?.groups) {
        req.body.groups.map(async (group) => {
          const room = new RoomSchema({
            roomId: makeId(30),
            assignmentId: assignment.id,
            title: makeId(5),
            status: "New",
            storagePath: "https://play.grwth.hk/?roomId=",
          });

          const groups = new GroupSchema({
            roomId: room.id,
            groupName: group.title,
            assignmentId: assignment.id,
            status: "New",
          });

          group.items.map(async (student) => {
            const createUser = new UserSchema({
              headImg: userInfo.headImg,
              nameEn: userInfo.nameEn,
              nameZh: userInfo.nameZh,
              userId: userInfo.userId,
              createdByAssignment: true,
              createdByShared: false,
              status: "New",
              role: "Teacher",
              roomId: room.id,
              assignmentId: assignment.id,
              groupId: groups.id,
              isFavorite: false,
            });

            const studentObject = new UserSchema({
              headImg: student.headImg,
              nameEn: student.nameEn,
              nameZh: student.nameZh,
              userId: student.userId,
              createdByAssignment: true,
              createdByShared: false,
              status: "New",
              role: "Student",
              roomId: room.id,
              groupId: groups.id,
              assignmentId: assignment.id,
              isFavorite: false,
            });

            await createUser.save();

            await studentObject.save();
          });
          await groups.save();
          await room.save();
        });
      } else {
        req.body.students.map(async (student) => {
          const room = new RoomSchema({
            roomId: makeId(30),
            assignmentId: assignment.id,
            title: makeId(5),
            status: "New",
            storagePath: "https://play.grwth.hk/?roomId=",
          });

          const createUser = new UserSchema({
            headImg: userInfo.headImg,
            nameEn: userInfo.nameEn,
            nameZh: userInfo.nameZh,
            userId: userInfo.userId,
            createdByAssignment: true,
            createdByShared: false,
            role: "Teacher",
            status: "New",
            roomId: room.id,
            assignmentId: assignment.id,
            isFavorite: false,
          });

          const studentObject = new UserSchema({
            headImg: student.headImg,
            nameEn: student.nameEn,
            nameZh: student.nameZh,
            userId: student.userId,
            createdByAssignment: true,
            createdByShared: false,
            role: "Student",
            status: "New",
            roomId: room.id,
            assignmentId: assignment.id,
            isFavorite: false,
          });

          await createUser.save();

          await studentObject.save();

          await room.save();
        });
      }

      await subject.save();
      await classObject.save();
      await assignment.save();

      const users = await UserSchema.find({ userId: userInfo.userId });
      let assignmentIds = [];
      users.map((user) => {
        if (user?.assignmentId) {
          assignmentIds.push(user.assignmentId.toString());
        }
      });
      const array = _.uniq(assignmentIds);
      AssignmentSchema.find({ _id: { $in: array } })
      .populate({ path: "rooms subject class students" })
      .populate({ path: "groups", populate: { path: "members room" } })
        .sort({ dueDate: 1 })
        .then((docs) => {
          res.json(docs);
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res
      .status(500)
      .json({ error: "Can't find teacher info. Please provide valid token." });
  }
};

exports.getAssignments = async (req, res, next) => {
  console.log(req.cookies);
  const users = await UserSchema.find({ userId: req.query.userId });
  let assignmentIds = [];
  users.map((user) => {
    if (user?.assignmentId) {
      assignmentIds.push(user.assignmentId.toString());
    }
  });
  const array = _.uniq(assignmentIds);
  AssignmentSchema.find({ _id: { $in: array } })
  .populate({ path: "rooms subject class students" })
  .populate({ path: "groups", populate: { path: "members room" } })
    .sort({ dueDate: 1 })
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

exports.getAssignmentById = async (req, res, next) => {
  AssignmentSchema.find({ _id: req.query.assignmentId })
    .populate({ path: "rooms subject class students" })
    .populate({ path: "groups", populate: { path: "members room" } })
    .sort({ dueDate: 1 })
    .then((docs) => {
      res.json(docs[0]);
    })

    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

exports.deleteAssignment = async (req, res, next) => {
  console.log(req.body.assignmentId);
  const deleteAssignmentQuery = await AssignmentSchema.findByIdAndRemove(
    req.body.assignmentId
  );

  const deleteClassQuery = await ClassSchema.deleteMany({
    assignmentId: req.body.assignmentId,
  });

  const deleteRoomsQuery = await RoomSchema.deleteMany({
    assignmentId: req.body.assignmentId,
  });

  const deleteSubjectQuery = await SubjectSchema.deleteMany({
    assignmentId: req.body.assignmentId,
  });

  const deleteUsersQuery = await UserSchema.deleteMany({
    assignmentId: req.body.assignmentId,
  });

  const deleteGroupsQuery = await GroupSchema.deleteMany({
    assignmentId: req.body.assignmentId,
  });

  Promise.all([
    deleteAssignmentQuery,
    deleteClassQuery,
    deleteRoomsQuery,
    deleteSubjectQuery,
    deleteUsersQuery,
    deleteGroupsQuery,
  ])
    .then((results) => {
      const result1 = results[0];
      const result2 = results[1];
      const result3 = results[2];
      const result4 = results[3];
      const result5 = results[4];
      const result6 = results[5];

      res.json({
        result: `${req.body.assignmentId} has been deleted successfully.`,
      });
      // Do something with the query results
    })
    .catch((error) => {
      if (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
        throw error;
      }
    });
};

exports.updateAssignment = async (req, res, next) => {
  console.log(req.body);
  const deleteSubjectQuery = await SubjectSchema.deleteOne({
    assignmentId: req.body.id,
  });

  const deleteClassQuery = await ClassSchema.deleteOne({
    assignmentId: req.body.id,
  });

  Promise.all([deleteSubjectQuery, deleteClassQuery])
    .then(async (results) => {
      console.log(results);
      const subject = new SubjectSchema({
        className: req.body.subject.className,
        shortName: req.body.subject.shortName,
        subjectId: req.body.subject.subjectId,
        shortName: req.body.subject.shortName,
        assignmentId: req.body.id,
      });

      const classObject = new ClassSchema({
        classId: req.body.class.classId,
        className: req.body.class.className,
        schoolId: req.body.class.schoolId,
        shortName: req.body.class.shortName,
        assignmentId: req.body.id,
      });

      const filter = { _id: req.body.id };
      const update = {
        title: req.body.title,
        grade: req.body.grade,
        dueDate: req.body.dueDate,
      };

      let doc = await AssignmentSchema.findOneAndUpdate(filter, update);

      await subject.save();
      await classObject.save();

      doc = await AssignmentSchema.findOne(filter);

      res.json({
        result: `${req.body.id} has been updated successfully.`,
      });
    })
    .catch((error) => {
      if (error) {
        res.status(500).json({ error: error.message });
        throw error;
      }
    });
};
