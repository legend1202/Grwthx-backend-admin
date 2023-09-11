const axios = require("axios");
const {
  AUTHORISATION_TOKEN_STORAGE_KEY,
  AUTHORISATION_USER_ID_STORAGE_KEY,
  AUTHORISATION_USER_NAME_STORAGE_KEY,
  AUTHORISATION_USER_HEAD_IMAGE_KEY,
  AUTHORISATION_USER_NAME_ZH_STORAGE_KEY,
} = require("../utils/constants");
const AssignmentSchema = require("../models/assignmentsModel");
const GroupSchema = require("../models/groupSchema");
const RoomSchema = require("../models/roomModel")

exports.get_accesstoken = async (req, res, next) => {
  const url = `https://uatgrwth.app360.cn/grwth-as/oauth/token?grant_type=authorization_code&code=${req.query.code
    }&client_id=grwth_x&client_secret=12345678&redirect_uri=${process.env.NODE_ENV === "development"
      ? "http://localhost:8081"
      : "https://grwthx.grwth.hk"
    }/sso-demo-client/callback`; //get access_token information
  const config = {
    method: "post",
    url: url,

    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
console.log(config, "get access token");
  axios(config)
    .then(function (response) {
      res.cookie(
        AUTHORISATION_TOKEN_STORAGE_KEY,
        "Bearer " + response.data.access_token
      );
      res.json(response.data);
    })
    .catch(function (error) {
      res.status(401).json(error.message);
    });
};

exports.get_userinfo = async (req, res, next) => {
  const url = "https://uatgrwth.app360.cn/grwth-as/api/getUserInfo"; // get userinfo from thirty party api
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
      console.log(response.data);
      res.cookie(AUTHORISATION_USER_ID_STORAGE_KEY, response.data.userId);
      res.cookie(AUTHORISATION_USER_NAME_STORAGE_KEY, response.data.nameEn);
      res.cookie(AUTHORISATION_USER_NAME_ZH_STORAGE_KEY, response.data.nameZh);
      res.cookie(AUTHORISATION_USER_HEAD_IMAGE_KEY, response.data.headImg);
      res.json(response.data);
    })
    .catch(function (error) {
      res.clearCookie();
    });
};

exports.getUserInfoByToken = async (req, res, next) => {
  const url = "https://uatgrwth.app360.cn/grwth-as/api/getUserInfo"; // get userinfo from thirty party api
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

exports.logout = async (req, res, next) => {
  res.clearCookie(AUTHORISATION_TOKEN_STORAGE_KEY);
      res.clearCookie(AUTHORISATION_USER_ID_STORAGE_KEY);
      res.clearCookie(AUTHORISATION_USER_NAME_STORAGE_KEY);
      res.clearCookie(AUTHORISATION_USER_NAME_ZH_STORAGE_KEY);
      res.clearCookie(AUTHORISATION_USER_HEAD_IMAGE_KEY);
      res.json("");
};

exports.getTotalInfo = async (req, res, next) => {
  const { assignmentId, roomId, userId } = req.body;
  if (assignmentId) {
    RoomSchema.find({roomId}).then((doc)=>{
      AssignmentSchema.find({ _id: assignmentId })
      .populate({ path: "subject class" })
      .populate({ path: 'students', populate: {path: 'room'} })
      .populate({ path: "rooms", match: { roomId } })
      .populate({ path: "groups", populate: { path: "members room" } })
      .sort({ dueDate: 1 })
      .then((docs) => {
        res.json(docs[0]);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
    })
   
  } else {
    RoomSchema.find({ roomId })
      .populate({ path: "sharingUsers", match: { role: "Student" } })
      .populate({ path: "group" })
      .then((docs) => {
        res.json(docs[0]);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  }
};
