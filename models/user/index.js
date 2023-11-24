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

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  important: Boolean,
});

module.exports = mongoose.model("User", userSchema);
