const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const blogSchema = new mongoose.Schema({
  category: String,
  title: String,
  article: String,
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
