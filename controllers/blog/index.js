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

    // Check if the user's interests include the blog's category
    if (!user.interests.includes(body.category)) {
      user.interests.push(body.category);
      await user.save();
    }

    const category = await Category.findOne({ categories: body.category });

    if (category) {
      // Check if the user is not already in the category followers
      if (!category.followers.includes(user._id)) {
        category.followers.push(user._id);
        await category.save();
      }

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
    console.error(error);
    res.status(400).json({ error: "Invalid token or other error" });
  }
};

const allBlogList = async (req, res) => {
  try {
    // Extracting query parameters
    const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
    const blogsPerPage = parseInt(req.query.blogsPerPage) || 3;

    // Calculate skip value based on page and blogsPerPage
    const skip = (page - 1) * blogsPerPage;

    // Fetch total count of blogs
    const totalRecords = await Blog.countDocuments();

    // Fetch blogs with pagination
    const blogs = await Blog.find({})
      .populate("creator", { username: 1 })
      .skip(skip)
      .limit(blogsPerPage);

    // Calculate total pages
    const totalPages = Math.ceil(totalRecords / blogsPerPage);

    // Prepare pagination information
    const pagination = {
      total_records: totalRecords,
      current_page: page,
      total_pages: totalPages,
      next_page: page < totalPages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
    };

    // Include pagination information in the response
    res.json({ blogs, pagination });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Blogs created by the authorized user
const userBlogList = async (req, res) => {
  const userId = req.params.id;
  const token = req.headers.authorization;

  try {
    // Extracting query parameters
    const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
    const blogsPerPage = parseInt(req.query.blogsPerPage) || 1;

    // Calculate skip value based on page and blogsPerPage
    const skip = (page - 1) * blogsPerPage;

    // Fetch total count of blogs for the user
    const totalRecords = await Blog.countDocuments({ creator: userId });

    // Fetch user's blogs with pagination
    const blogs = await Blog.find({ creator: userId })
      .populate("creator", { username: 1 })
      .skip(skip)
      .limit(blogsPerPage);

    // Calculate total pages for the user's blogs
    const totalPages = Math.ceil(totalRecords / blogsPerPage);

    // Prepare pagination information
    const pagination = {
      total_records: totalRecords,
      current_page: page,
      total_pages: totalPages,
      next_page: page < totalPages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
    };

    // Include pagination information in the response
    res.json({ blogs, pagination });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const userInterestedBlogs = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    // Decode the token to get user information
    const decoded = jwt.verify(token, secretKey);

    // Fetch user interests
    const user = await User.findById(decoded.userId);
    const userInterests = user.interests;

    // Extracting query parameters for pagination
    const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
    const blogsPerPage = parseInt(req.query.blogsPerPage) || 1;

    // Calculate skip value based on page and blogsPerPage
    const skip = (page - 1) * blogsPerPage;

    // Fetch total count of blogs for the user's interests
    const totalRecords = await Blog.countDocuments({
      category: { $in: userInterests },
    });

    // Fetch blogs with matching interests and pagination
    const blogs = await Blog.find({
      category: { $in: userInterests },
    })
      .populate("creator", { username: 1 })
      .skip(skip)
      .limit(blogsPerPage);

    // Calculate total pages for the user's interested blogs
    const totalPages = Math.ceil(totalRecords / blogsPerPage);

    // Prepare pagination information
    const pagination = {
      total_records: totalRecords,
      current_page: page,
      total_pages: totalPages,
      next_page: page < totalPages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
    };

    // Include pagination information in the response
    res.json({ blogs, pagination });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get blogs by category name
const getBlogsByCategory = async (req, res) => {
  const { categoryName } = req.params;

  try {
    if (!categoryName) {
      return res
        .status(400)
        .json({ error: "Invalid or missing category name" });
    }

    // Extracting query parameters for pagination
    const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
    const blogsPerPage = parseInt(req.query.blogsPerPage) || 1;

    // Calculate skip value based on page and blogsPerPage
    const skip = (page - 1) * blogsPerPage;

    // Find the category by name
    const category = await Category.findOne({ categories: categoryName });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Extract blog IDs from the category
    const blogIds = category.blogs;

    // Fetch the total count of blogs for the category
    const totalRecords = blogIds.length;

    // Fetch the blogs with pagination using the extracted IDs
    const blogs = await Blog.find({ _id: { $in: blogIds } })
      .populate("creator", { username: 1 })
      .skip(skip)
      .limit(blogsPerPage);

    // Calculate total pages for the category's blogs
    const totalPages = Math.ceil(totalRecords / blogsPerPage);

    // Prepare pagination information
    const pagination = {
      total_records: totalRecords,
      current_page: page,
      total_pages: totalPages,
      next_page: page < totalPages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
    };

    // Include pagination information in the response
    res.json({ blogs, pagination });
  } catch (error) {
    console.error("Error fetching blogs by category:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Single blog
const singleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("creator", {
      username: 1,
    });

    if (blog) {
      res.json(blog);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(400).json({ error: "malformatted id" });
  }
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

// In your controllers file (blogController.js)
const isBlogLiked = async (req, res) => {
  const blogId = req.params.id;
  const token = req.headers.authorization;

  try {
    // Decode the token to get user information
    const decoded = jwt.verify(token, secretKey);

    // Check if the blog is liked by the user
    const user = await User.findById(decoded.userId);
    const userId = user._id.toString();

    const blog = await Blog.findById(blogId);
    const isLiked = blog.likedBy.includes(userId);

    res.json({ isLiked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete the blog
const blogDelete = async (req, res) => {
  const blogId = req.params.id;

  try {
    const user = await User.findOne({ blogs: blogId });

    await User.findByIdAndUpdate(user?._id, { $pull: { blogs: blogId } });

    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const category = await Category.findOne({ blogs: blogId });

    if (category) {
      await Category.findByIdAndUpdate(category._id, {
        $pull: { blogs: blogId },
      });
    }

    // Send success response
    res.json({ success: "Blog removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTopBlogs = async (req, res) => {
  try {
    const topBlogs = await Blog.find()
      .sort({ likes: -1 })
      .limit(6)
      .populate("creator", { username: 1 });

    res.json(topBlogs);
  } catch (error) {
    console.error("Error fetching top blogs:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createBlog,
  userBlogList,
  allBlogList,
  getBlogsByCategory,
  userInterestedBlogs,
  singleBlog,
  blogDelete,
  updateBlog,
  blogLike,
  blogUnlike,
  isBlogLiked,
  getTopBlogs,
};
