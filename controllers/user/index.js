// const generateAccessToken = require("../../middleware/tokenGenerator");
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
const getUSers = async (req, res) => {
  User.find({}).then((blogs) => {
    res.json(blogs);
  });
};

// Find a user by ID
const getSingleUser = async (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);

      res.status(400).send({ error: "malformatted id" });
    });
};

module.exports = {
  userCreate,
  getUSers,
  getSingleUser,
};