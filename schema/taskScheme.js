const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const taskScheme = new Schema({
  name: {
    type: String,
    required: true,
    min: 4
  },
  description: String,
  importance: {
    type: Number,
    min: 0,
    max: 10
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  },
  done: {
    type: Boolean,
    default: false
  }
});

let Task;
try {
  Task = mongoose.model("Tasks");
} catch (error) {
  Task = mongoose.model("Tasks", taskScheme);
}

module.exports = Task;
