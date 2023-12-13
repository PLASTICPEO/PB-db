const bcrypt = require("bcrypt");
const User = require("../../models/user/index");

const generateAccessToken = require("../../middleware/tokenGenerator");

// const authenticateToken = (req, res, next) => {
//   const token =
//     req.headers.authorization && req.headers.authorization.split(" ")[1];

//   if (!token) return res.status(401).json({ error: "Unauthorized" });

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ error: "Forbidden" });
//     req.user = user; // Attach the decoded user information to the request object
//     next();
//   });
// };

const signIn = async (req, response) => {
  try {
    // Find the user by username
    const user = await User.findOne({ username: req.body.username });

    if (
      user &&
      typeof req.body.password === "string" &&
      (await bcrypt.compare(req.body.password, user.password))
    ) {
      // Generate and return an access token
      const accessToken = generateAccessToken({ username: user.username });
      response.json({ accessToken: accessToken });
    } else {
      response.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
};

module.exports = {
  signIn,
};
