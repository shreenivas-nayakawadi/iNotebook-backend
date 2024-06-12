// importing express framework
const express = require("express");
// importing User model
const User = require("../models/User");
// importing express router to access over the routes
const router = express.Router();
// improting bcryptjs to encrypt the passowords
const bcrypt = require("bcryptjs");
// importing validator to validate the fields of the Usser
const { body, validationResult } = require("express-validator");
// creating token , this token is used to verify the authentication of the user, and it should be kept safe should not share with anyone
const JWT_SECERT = "Shree@dsce";
// importing jwt
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

// jwt{json web token: this token is given to the user when he creates the account} token makes a secure connection between the client and the server

// ROUTE 1: create a user using: POST "/api/auth/createuser". doesn't require any login
router.post(
  "/createuser",
  [
    // accepting the name email and password from the user
    body("name", "enter a valid name").isLength({ min: 3 }),
    body("email", "enter a valid email").isEmail(),
    body("password", "password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //try creating the user
    try {
      // check whether user with email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "sorry a user with this email already exists" });
      }

      // create salt {salt is basically a hash we add at the end of our password for more security}
      const salt = await bcrypt.genSalt(10);
      // adding a salt at the end of the password and creating the hash
      const securePass = await bcrypt.hash(req.body.password, salt);
      // creating the user using the module User
      user = await User.create({
        name: req.body.name,
        password: securePass,
        email: req.body.email,
      });
      // sending user as a reponse
      const data = {
        user: {
          id: user.id,
        },
      };

      // creating the jwt token for authenticataion
      const authtoken = jwt.sign(data, JWT_SECERT);
      // sending authtoken as response
      res.json({ authtoken });
      // using authtoken we can retrieve the userid and check is anyone tampered the data
    } catch (error) {
      // if you find any error send the error to console and send response status 500{The status code 500 indicates an internal server error, meaning something went wrong on the server side.}
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

// ROUTE 2: login of the user using "/api/auth/login": checking the login credentials wether they are correct or not
router.post(
  "/login",
  [
    body("email", "enter a valid email").isEmail(),
    body("password", "password must be atleast 5 characters").exists(),
  ],
  async (req, res) => {
    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // creating email and password variables
    const { email, password } = req.body;
    try {
      // acquiring the data from the database
      let user = await User.findOne({ email });

      // if you cannot find the user return the error status
      if (!user) {
        return res
          .status(400)
          .json({ error: "please try to login with correct credentials" });
      }

      // after finding the user compare entered password with the database password
      const passwordCompare = await bcrypt.compare(password, user.password);

      // if password is wrong send error
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "please try to login with correct credentials" });
      }

      // get the user id from the database
      const data = {
        user: {
          id: user.id,
        },
      };

      // create the authtoken using jwt
      const authtoken = jwt.sign(data, JWT_SECERT);

      // return the authtoken as response to user
      res.json({ authtoken });
    } catch (error) {
      // if any kind of error occured inside the server send the error response and print the error inside the console
      console.error(error.message);
      res.status(500).send("internal server error occured");
    }
  }
);

// ROUTE 3: get logged in user details  using : post"/api/auth/getuser : login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
     userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error occured");
  }
});

// export router object
module.exports = router;
