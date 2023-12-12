const jwt = require("jsonwebtoken");

// Token generation
const generateAccessToken = (payload) => {
  const secretKey = process.env.JWT_SECRET; // Use your actual secret key
  const tokenType = "Bearer";

  // Include token type in the JWT
  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
  const accessToken = `${tokenType} ${token}`;

  return accessToken; // Adjust expiresIn and other parameters as needed
};

module.exports = generateAccessToken;
