const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const userScheme = new Schema({
  name: {
    type: String,
    required: true,
    min: 4
},
  id: String
});

let User;
try {
  User = mongoose.model('Users')
} catch (error) {
  User = mongoose.model('Users', userScheme)
}

module.exports = User;