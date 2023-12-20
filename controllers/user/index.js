// const generateAccessToken = require("../../middleware/tokenGenerator");
const secretKey = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const User = require("../../models/user/index");

// Create a new user
const userCreate = async (request, response) => {
  const body = request.body;

  if (!body.email || !body.password) {
    return response
      .status(400)
      .json({ error: "Email and password are required" });
  }

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return response
        .status(400)
        .json({ error: "Email is already registered" });
    }

    // Create a new user
    const newUser = new User({
      email: body.email,
      username: body.username,
      password: body.password,
    });

    // Save the user to the database
    await newUser.save();

    // Generate and return an access token
    // const accessToken = generateAccessToken({ username: newUser.username });

    response.json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal server error" });
  }
};

// All users
const getUsers = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  const users = await User.find({}).populate("blogs", {
    category: 1,
    title: 1,
    article: 1,
    _id: 1,
  });

  res.json(users);
};

// Find a user by ID
const getSingleUser = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    // Find the user by ID
    const user = await User.findById(decoded.userId);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid token or other error" });
  }
};

module.exports = {
  userCreate,
  getUsers,
  getSingleUser,
};
