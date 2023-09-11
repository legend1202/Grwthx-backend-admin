const axios = require("axios");
const { AUTHORISATION_TOKEN_STORAGE_KEY } = require("../utils/constants");

exports.getClassUsers = async (req, res, next) => {
  console.log('===========')
  const url = `https://uatgrwth.app360.cn/grwth-as/api/getClassUsers?classId=${req.body.classId}`;
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
        console.log(response.data.students)
      res.json(response.data.students);
    })
    .catch(function (error) {
        console.log(error)

      res.status(401).json(error.message);
    });
};
