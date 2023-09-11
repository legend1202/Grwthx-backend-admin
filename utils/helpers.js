const axios = require("axios");
const _ = require('lodash')

exports.getUserInfoFromToken = async (authToken) => {
  const url = "https://uatgrwth.app360.cn/grwth-as/api/getUserInfo"; // get userinfo from thirty party api
  const config = {
    method: "post",
    url: url,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      withCredentials: true,
      Authorization: authToken,
    },
  };

  let res = false;

  await axios(config)
    .then(function (response) {
      res = response.data;
    })
    .catch(function (error) {
      res = false;
    });

  return res;
};

exports.makeId = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};
