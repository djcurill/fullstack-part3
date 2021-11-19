const express = require('express');
const notes = require('./persons');

const PORT = 3001;
const notesEndpoint = `/api/persons`;

const app = express();

app.get(notesEndpoint, (req, res) => {
  res.json(notes);
});

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
