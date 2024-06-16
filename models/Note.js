// importing the the mongoose library to create the schema
const mongoose = require("mongoose");
// importing the schema{schema is basically a structure of database}
const { Schema } = mongoose;

// creating the schema
const NotesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "General",
  },
  tag: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Notes = mongoose.model("Notes", NotesSchema);
module.exports = Notes;