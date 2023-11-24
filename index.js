// Importing necessary modules
require("dotenv").config();
const http = require("http");
const cors = require("cors");
const express = require("express");
const app = express();

const Note = require("./models/note/index");
const User = require("./models/user/index");

// Middleware for logging requests
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

// Middleware to handle unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// Using Express middleware to parse JSON and log requests
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Route to display a welcome message
app.get("/", (request, response) => {
  response.send("<h1>Hello Backend</h1>");
});

// Route to get all notes
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

// Route to get all user
app.get("/api/user", (request, response) => {
  User.find({}).then((user) => {
    response.json(user);
  });
});

// Route to get a specific note by ID
app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);

      response.status(400).send({ error: "malformatted id" });
    });
});

// Route to get specitic user by ID
app.get("/api/user/:id", (request, response) => {
  User.findById(request.params.id)
    .then((user) => {
      if (user) {
        response.json(user);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);

      response.status(400).send({ error: "malformatted id" });
    });
});

// Route to add a new note
app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    username: body.username,
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

// Route to add a new user
app.post("/api/user", (request, response) => {
  const body = request.body;
  console.log(body, "ბოდუ");
  if (body.password === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const user = new User({
    username: body.username,
    password: body.password,
    important: body.important || false,
  });

  user.save().then((savedUser) => {
    response.json(savedUser);
  });
});

// Route to delete a note by ID
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);

  response.status(204).end();
});

// Using the unknownEndpoint middleware for any other paths
app.use(unknownEndpoint);

// Setting up and starting the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
