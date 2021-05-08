// Dependencies

const express = require('express');
const path = require('path');
const fs = require('fs');
const {v4 : uuidv4} = require('uuid');
const notes = require('./db/db');
// Sets up the Express App

const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")) /// to access files in public folder

// Routes

// Basic route that sends the user first to the Home Page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

// Displays all Notes
app.get('/api/notes', (req, res) => res.json(notes));

/// Delete note
app.delete('/api/notes/:id', (req, res) => { 
  const noteId = req.params.id;
  //console.log("delete-id : " + noteId);
  for (let i = 0; i < notes.length; i++) {
    if (noteId === notes[i].id) {
      notes.splice(i,1);
    }
  }

  fs.writeFile("db/db.json", JSON.stringify(notes), err => {
    if (err) throw err; // Checking for errors
    console.log("Done deleting"); // Success
  });

  res.json(notes);
});

/// Update Note
app.put('/api/notes/:id', (req, res) => { 
  const updNote = req.body;
  const noteId = req.params.id;
  //console.log(noteId);
  //console.log(updNote);
  for (let i = 0; i < notes.length; i++) {
    if (noteId === notes[i].id) {
      notes[i] = updNote;
    }
  }

  fs.writeFile("db/db.json", JSON.stringify(notes), err => {
    if (err) throw err; // Checking for errors
    console.log("Done updating"); // Success
  });

  res.json(newNote);
});

// Create New Notes - takes in JSON input
// req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
app.post('/api/notes', (req, res) => { 
  const newNote = req.body;
  const noteId = uuidv4();
  newNote.id = noteId;
  //console.log(newNote);
  notes.push(newNote);
  fs.writeFile("db/db.json", JSON.stringify(notes), err => {
    if (err) throw err; // Checking for errors
    //console.log("Done writing"); // Success
  });

  res.json(newNote);
});

// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs.
//require('./assets/js/index')(app);

// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
