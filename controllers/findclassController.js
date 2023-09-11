const axios = require("axios");
const SubjectSchema = require("../models/subjectModel");
const { AUTHORISATION_TOKEN_STORAGE_KEY } = require("../utils/constants.js");

exports.get_class = async (req, res, next) => {
  const url = "https://uatgrwth.app360.cn/grwth-as/api/findClass"; // find class information from thrity party api
  const config = {
    method: "post",
    url: url,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      withCredentials: true,
      Authorization: req.cookies[AUTHORISATION_TOKEN_STORAGE_KEY],
    },
  };

  axios(config)
    .then(function (response) {
      const userDataArr = [];
      response.data.forEach((oneclass) => {
        userDataArr.push(oneclass.shortName);
      });
      res.json(userDataArr);
    })
    .catch(function (error) {
      res.status(400).json(error.message);
    });
};

exports.get_class_original = async (req, res, next) => {
  const url = "https://uatgrwth.app360.cn/grwth-as/api/findClass"; // find class information from thrity party api
  const config = {
    method: "post",
    url: url,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      withCredentials: true,
      Authorization: req.cookies[AUTHORISATION_TOKEN_STORAGE_KEY],
    },
  };

  axios(config)
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      res.status(400).json(error.message);
    });
};

exports.get_subject = async (req, res, next) => {
  const url = "https://uatgrwth.app360.cn/grwth-as/api/findSubjects"; // get subject information from thirty party api
  const config = {
    method: "post",
    url: url,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      withCredentials: true,
      Authorization: req.cookies[AUTHORISATION_TOKEN_STORAGE_KEY],
    },
  };

  console.log(req.cookies[AUTHORISATION_TOKEN_STORAGE_KEY]);

  axios(config)
    .then(function (response) {
      const subjectDataArr = [];
      response.data.forEach((onesubject) => {
        subjectDataArr.push(onesubject.shortName);
      });

      if (subjectDataArr.length === 0) {
        SubjectSchema.aggregate([
          { $group: { _id: "$shortName", count: { $sum: 1 } } },
        ]).exec((err, results) => {
          if (err) {
            res.status(400).json(err.message);
          } else {
            results.map((onesubject) => {
              console.log(onesubject);
              subjectDataArr.push(onesubject._id);
            });
            res.json(subjectDataArr);
          }
        });
      } else {
        res.json(subjectDataArr);
      }
    })
    .catch(function (error) {
      console.log(error.message);
      res.status(400).json(error.message);
    });
};

exports.get_subject_original = async (req, res, next) => {
  const url = "https://uatgrwth.app360.cn/grwth-as/api/findSubjects"; // get subject information from thirty party api
  const config = {
    method: "post",
    url: url,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      withCredentials: true,
      Authorization: req.cookies[AUTHORISATION_TOKEN_STORAGE_KEY],
    },
  };

  axios(config)
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      res.status(400).json(error.message);
    });
};
