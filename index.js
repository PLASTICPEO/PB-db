// Importing necessary modules
const http = require("http");
const cors = require("cors");
const express = require("express");
const app = express();

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

// Sample notes data
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// Function to generate a unique ID for a new note
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

// Route to display a welcome message
app.get("/", (request, response) => {
  response.send("<h1>Hello Backend</h1>");
});

// Route to get all notes
app.get("/api/notes", (request, response) => {
  response.json(notes);
});

// Route to get a specific note by ID
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

// Route to add a new note
app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);
  console.log("მონაცემი დაემატა");
  response.json(note);
});

// Route to delete a note by ID
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  console.log("წაიშალა"); // Logging deletion
  response.status(204).end();
});

// Using the unknownEndpoint middleware for any other paths
app.use(unknownEndpoint);

// Setting up and starting the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
console.log(`Server running on port ${PORT}`);