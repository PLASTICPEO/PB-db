const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = `mongodb+srv://e-commerce:e-commerce@phonebook.sqmzhzh.mongodb.net/?retryWrites=true&w=majority`;

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
