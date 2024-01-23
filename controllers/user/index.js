// const generateAccessToken = require("../../middleware/tokenGenerator");
const secretKey = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const User = require("../../models/user/index");
const Category = require("../../models/category/index");

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
    const existingEmail = await User.findOne({ email: body.email });
    if (existingEmail) {
      return response
        .status(400)
        .json({ error: "Email is already registered" });
    }

    // Check if the username is already registered
    const existingUsername = await User.findOne({ username: body.username });
    if (existingUsername) {
      return response
        .status(400)
        .json({ error: "Username is already registered" });
    }

    // Create a new user
    const newUser = new User({
      email: body.email,
      username: body.username,
      password: body.password,
      interests: body.interests,
    });

    // Save the user to the database
    await newUser.save();

    // Update the categories with the user's ID in the followers array

    for (const interest of body.interests) {
      const category = await Category.findOne({ categories: interest });

      console.log(category, "კატეგორი");

      if (category) {
        if (!category.followers.includes(newUser._id)) {
          category.followers.push(newUser._id);
          await category.save();
        }
      } else {
        console.error("Category not found:", interest);
      }
    }

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
  const userId = req.params.userID;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

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

// Me request
const getMe = async (req, res) => {
  const body = req.body;
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
  getMe,
  userCreate,
  getUsers,
  getSingleUser,
};
