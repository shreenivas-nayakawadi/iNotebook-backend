// importing tthe mongoose to the app for the connection with the mongodb database
const mongoose = require('mongoose');
// conncetion link of our mongodb database
const mongoURI = 'mongodb://localhost:27017/inotebook';

// function to connect the database 
const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("connected to mongo successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

// exporting the module
module.exports = connectToMongo;
