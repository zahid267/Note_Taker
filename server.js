// Dependencies

const express = require('express');
const path = require('path');
const fs = require('fs');
const {v4 : uuidv4} = require('uuid');
const notes = require("./db/db");
// Sets up the Express App

const app = express();
const PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
/*
const characters = [
  {
    routeName: 'yoda',
    name: 'Yoda',
    role: 'Jedi Master',
    age: 900,
    forcePoints: 2000,
  },
  {
    routeName: 'darthmaul',
    name: 'Darth Maul',
    role: 'Sith Lord',
    age: 200,
    forcePoints: 1200,
  },
  {
    routeName: 'obiwankenobi',
    name: 'Obi Wan Kenobi',
    role: 'Jedi Master',
    age: 55,
    forcePoints: 1350,
  },
];*/

// Routes

// Basic route that sends the user first to the AJAX Page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'notes.html')));

// Displays all characters
//app.get('/api/characters', (req, res) => res.json(characters));

// Displays a single character, or returns false
/*app.get('/api/characters/:character', (req, res) => {
  const chosen = req.params.character;
  console.log(chosen);
  for (let i = 0; i < characters.length; i++) {
    if (chosen === characters[i].routeName) {
      return res.json(characters[i]);
    }
  }
  return res.json(false);
});*/

// Create New Notes - takes in JSON input
app.post('/api/notes', (req, res) => {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  const newNote = req.body;
  const noteId = uuidv4();
  newNote.id = noteId;
  // Using a RegEx Pattern to remove spaces from newCharacter
  // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
  
  newNote.title = newNote.title.replace(/\s+/g, '');
  newNote.text = newNote.text.replace(/\s+/g, '');
  console.log(newNote);
  
  notes.push(newNote);
  fs.writeFile(".db/db.json", JSON.stringify(notes), err => {
    // Checking for errors
    if (err) throw err; 
    console.log("Done writing"); // Success
  });

  res.json(newNote);
});

// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs.

//require('./assets/js/index')(app);

// Starts the server to begin listening

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
