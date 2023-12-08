const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://e-commerce:${password}@phonebook.sqmzhzh.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const blogSchema = new mongoose.Schema({
  category: String,
  title: String,
  article: String,
  important: Boolean,
});

const Blog = mongoose.model("Blog", blogSchema);

// note.save().then((result) => {
//   console.log("note saved!");
//   mongoose.connection.close();
// });

Blog.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  important: Boolean,
});

const User = mongoose.model("User", noteSchema);

// note.save().then((result) => {
//   console.log("note saved!");
//   mongoose.connection.close();
// });

User.find({}).then((result) => {
  result.forEach((user) => {
    console.log(user);
  });
  mongoose.connection.close();
});
