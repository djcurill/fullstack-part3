const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const Person = require('./models/person');

require('dotenv').config();
const PORT = process.env.PORT || 3001;
const personsEndpoint = `/api/persons`;
const infoEndpoint = '/info';

mongoose.connect(process.env.MONGODB_URI);

morgan.token('data', (req, res) => {
  if (req.method === 'POST') return JSON.stringify(req.body);
});

const app = express();
app.use(express.static('build'));
app.use(express.json()); // add json parser middle ware
app.use(cors()); // enable cross origin communication
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
);

app.get(personsEndpoint, (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

app.get(`${personsEndpoint}/:id`, (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) return res.status(400).end();

  Person.findById(id).then((person) => {
    if (person) res.json(person);
    else res.status(404).end();
  });
});

app.get(infoEndpoint, (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p> ${new Date()}`
  );
});

app.delete(`${personsEndpoint}/:id`, (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: 'invalid id type' });

  Person.findByIdAndDelete(id).then((result) => {
    if (result === null) return res.status(204).end();
    return res.status(204).end();
  });
});

app.post(personsEndpoint, (req, res) => {
  const newPerson = req.body;

  if (!newPerson.number || !newPerson.name) {
    return res.status(400).json({ error: 'Missing name and/or number fields' });
  }

  if (persons.some((person) => person.name === newPerson.name)) {
    return res.status(400).json({ error: 'name must be unique' });
  }

  Person.create(newPerson).then((createdPerson) => {
    return res.status(201).json(createdPerson);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
