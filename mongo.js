const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://e-commerce:${password}@phonebook.sqmzhzh.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);
