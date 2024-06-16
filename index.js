// connecting the database to the app
const connectToMongo = require("./db");
// importing the express framework for the app
const express = require("express");
var cors =require('cors')

// calling function to connect with database, and creating express variable and assigning port to the app
connectToMongo();
const app = express();
const port = 5000;


app.use(cors())

// a built-in middleware function in Express that parses incoming requests with JSON payloads.
app.use(express.json());

// available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

// sending response whn we hit "/"
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// method to make server to response to the particular port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
