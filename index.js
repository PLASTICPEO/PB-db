// Importing necessary modules
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Create Express app
const app = express();

// Middleware for logging requests
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

// Using Express middleware to parse JSON and log requests
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Importing routers
const authRouter = require("./routes/auth/index");
const blogRouter = require("./routes/blog/index");
const userRouter = require("./routes/user/index");

// Define routes
app.use("/api/auth", authRouter);
app.use("/api/blog", blogRouter);
app.use("/api/user", userRouter);

// Route for the root path ("/")
app.get("/", (request, response) => {
  response.send("Welcome to the backend endpoint of Plastic Blog");
});

// Middleware to handle unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// Using the unknownEndpoint middleware for any other paths
app.use(unknownEndpoint);

// Setting up and starting the server
const PORT = process.env.PORT || 3000; // Adjust the default port if needed
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
