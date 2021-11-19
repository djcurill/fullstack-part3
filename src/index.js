const express = require('express');
const morgan = require('morgan');
let persons = require('./persons');

const PORT = 3001;
const personsEndpoint = `/api/persons`;
const infoEndpoint = '/info';

morgan.token('data', (req, res) => {
  if (req.method === 'POST') return JSON.stringify(req.body);
});

const app = express();
app.use(express.json()); // add json parser middle ware
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
);

app.get(personsEndpoint, (req, res) => {
  res.json(persons);
});

app.get(`${personsEndpoint}/:id`, (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === Number(id));
  if (person) res.json(person);
  else res.status(404).end();
});

app.get(infoEndpoint, (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p> ${new Date()}`
  );
});

app.delete(`${personsEndpoint}/:id`, (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post(personsEndpoint, (req, res) => {
  const newPerson = req.body;

  if (!newPerson.number || !newPerson.name) {
    console.log('one');
    return res.status(400).json({ error: 'Missing name and/or number fields' });
  }

  if (persons.some((person) => person.name === newPerson.name)) {
    return res.status(400).json({ error: 'name must be unique' });
  }
  console.log('two');
  newPerson.id = Math.floor(Math.random() * 5000);
  persons = persons.concat(newPerson);
  res.status(201).json(newPerson);
});

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
