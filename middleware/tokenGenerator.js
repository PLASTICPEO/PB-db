const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  const secretKey = process.env.JWT_SECRET;
  return jwt.sign({ userId: user.userId, username: user.username }, secretKey, {
    expiresIn: "3h",
  });
};

module.exports = generateAccessToken;
