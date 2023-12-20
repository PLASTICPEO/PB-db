const Blog = require("../../models/blog/index");
const User = require("../../models/user/index");
const Category = require("../../models/category/index");
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
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findById(decoded.userId);

    const newBlog = new Blog({
      category: body.category,
      title: body.title,
      article: body.article,
      important: body.important || false,
      likes: 0,
      likedBy: [],
      creator: user._id,
    });

    const savedBlog = await newBlog.save();
    user.blogs = user.blogs.concat(savedBlog._id.toString());
    await user.save();

    const category = await Category.findOne({ categories: body.category });

    if (category) {
      category.blogs = category.blogs.concat(savedBlog._id.toString());
      await category.save();
    } else {
      console.error("Category not found:", body.category);
    }

    res.json({
      title: savedBlog,
      status: "Blog added successfully",
    });
  } catch (error) {
    res.status(400).json({ error: "Invalid token or other error" });
  }
};

// All blog
const blogList = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const blogs = await Blog.find({}).populate("creator", {
      username: 1,
    });

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
      res.status(400).send({ error: "malformatted id" });
    });
};

// Update blog
const updateBlog = async (req, res) => {
  const blogId = req.params.id;

  const { title, article, category, important } = req.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $set: {
          title,
          article,
          category,
          important,
        },
      },
      { new: true }
    );

    if (updatedBlog) {
      res.json(updatedBlog);
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const blogLike = async (req, res) => {
  const blogId = req.params.id;
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, secretKey);
  const user = await User.findById(decoded.userId);
  const userId = user._id.toString();

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $addToSet: { likedBy: userId },
        $inc: { likes: 1 },
      },
      { new: true }
    );

    if (updatedBlog) {
      res.json(updatedBlog);
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const blogUnlike = async (req, res) => {
  const blogId = req.params.id;
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, secretKey);
  const user = await User.findById(decoded.userId);
  const userId = user._id.toString();

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likedBy: userId },
        $inc: { likes: -1 },
      },
      { new: true }
    );

    if (updatedBlog) {
      res.json(updatedBlog);
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete the blog
const blogDelete = async (req, res) => {
  const blogId = req.params.id;
  const user = await User.findOne({ blogs: blogId });
  await User.findByIdAndUpdate(user?._id, { $pull: { blogs: blogId } });

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
  updateBlog,
  blogLike,
  blogUnlike,
};
