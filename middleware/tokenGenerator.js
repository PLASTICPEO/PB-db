// middleware/tokenGenerator.js

const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  const secretKey = process.env.JWT_SECRET;
  return jwt.sign({ userId: user._id, username: user.username }, secretKey, {
    expiresIn: "3h",
  });
};

module.exports = generateAccessToken;

// const jwt = require("jsonwebtoken");

// // Token generation
// const generateAccessToken = (payload) => {
//   const secretKey = process.env.JWT_SECRET; // Use your actual secret key
//   return jwt.sign(payload, secretKey, { expiresIn: "3h" }); // Adjust expiresIn as needed
// };

// module.exports = generateAccessToken;
