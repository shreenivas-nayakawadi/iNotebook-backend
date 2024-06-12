var jwt = require("jsonwebtoken");
const JWT_SECRET = "Shree@dsce";

const fetchuser = (req, res, next) => {
  // get the user id form the jwt token and add id to req object
  // taking auth-token form the header
  const token = req.header("auth-token");
  // if token not found or invalid send response
  if (!token) {
    res
      .status(401)
      .send({ error: "please authenticate using the valid token" });
  }
  try {
    // verify the token
    const data = jwt.verify(token, JWT_SECRET);
    // insert the data into the request so that we can acquire when the fetchuser is called in any function
    req.user = data.user;
    next();
  } catch (error) {
    response
      .status(401)
      .send("please authenticate using the valid credentials");
  }
};

module.exports = fetchuser;
