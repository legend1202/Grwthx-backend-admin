const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Library = new Schema({
  id: {
    type: String
  },
  name: {
    type: String
  },
  title: {
    type: String
  },
  type: {
    type: String
  },
  favourite: {
    type: Boolean
  },
  imageurl: {
    type: String
  }
},
  {
    collection: 'library'
  });

module.exports = mongoose.model('Library', Library);