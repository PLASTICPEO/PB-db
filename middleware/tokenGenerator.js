const jwt = require("jsonwebtoken");

// Token generation
const generateAccessToken = (payload) => {
  const secretKey = process.env.JWT_SECRET; // Use your actual secret key
  return jwt.sign(payload, secretKey, { expiresIn: "1h" }); // Adjust expiresIn as needed
};

module.exports = generateAccessToken;
