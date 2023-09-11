const library = require("../utils/mockData");
const Mongoose = require("mongoose");

exports.getLibrary = (req, res) => {
  res.json(library.libraries);
};
