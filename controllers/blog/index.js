const Blog = require("../../models/blog/index");

// Create new blog
const createBlog = async (req, res) => {
  const body = req.body;
  const token = req.heades.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  if (!body) {
    return res.status(400).json({ error: "Content missing" });
  }

  const newBlog = new Blog({
    category: body.category,
    title: body.title,
    article: body.article,
    important: body.important || false,
  });

  newBlog
    .save()
    .then((blog) => {
      res.json({
        title: blog.title,
        status: "Blog added successfully",
      });
    })
    .catch((error) => {
      res.status(400).json(error);
    });
};

// All blog
const blogList = async (req, res) => {
  const token = req.heades.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }
  Blog.find({}).then((blogs) => {
    res.json(blogs);
  });
};

// Single blog
const singleBlog = async (req, res) => {
  const token = req.heades.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }
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

  const token = req.heades.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

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
