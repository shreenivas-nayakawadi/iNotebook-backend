// importing the the mongoose library to create the schema
const mongoose = require("mongoose");
// importing the schema{schema is basically a structure of database}
const { Schema } = mongoose;

// creating the schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// exporting the schema by making it model {model: a wrapper of the Mongoose schema}
const User = mongoose.model("User", UserSchema);
module.exports = User;
