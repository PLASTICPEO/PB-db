const Blog = require("../../models/blog/index");
const secretKey = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

// Create new blog
const createBlog = async (req, res) => {
  const body = req.body;
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  if (!body) {
    return res.status(400).json({ error: "Content missing" });
  }

  try {
    // Decode the token to get user information
    const decodedToken = jwt.verify(token, secretKey); // Replace with your actual secret key

    const newBlog = new Blog({
      category: body.category,
      title: body.title,
      article: body.article,
      important: body.important || false,
      userId: decodedToken.userId, // Assuming the user ID is stored in the token
    });

    const savedBlog = await newBlog.save();

    res.json({
      title: savedBlog.title,
      status: "Blog added successfully",
    });
  } catch (error) {
    res.status(400).json({ error: "Invalid token or other error" });
  }
};

// All blog
const blogList = async (req, res) => {
  Blog.find({}).then((blogs) => {
    res.json(blogs);
  });
};

// Single blog
const singleBlog = async (req, res) => {
  Blog.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);

      res.status(400).send({ error: "malformatted id" });
    });
};

// Delete the blog
const blogDelete = async (req, res) => {
  const blogId = req.params.id;

  Blog.findByIdAndDelete(blogId)
    .then((deletedBlog) => {
      if (deletedBlog) {
        res.json({ success: "Blog removed successfully" });
        res.status(204).end();
      } else {
        res.status(404).json({ error: "Blog not found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

module.exports = {
  createBlog,
  blogList,
  singleBlog,
  blogDelete,
};
