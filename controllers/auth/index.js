const bcrypt = require("bcrypt");
const User = require("../../models/user/index");

const generateAccessToken = require("../../middleware/tokenGenerator");

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
