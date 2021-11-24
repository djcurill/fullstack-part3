const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const Person = require('./models/person');
const badIdHandler = require('./middleware/error');

console.log(badIdHandler);

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

app.get(`${personsEndpoint}/:id`, (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) res.json(person);
      else res.status(404).end();
    })
    .catch((err) => next(err));
});

app.get(infoEndpoint, (req, res) => {
  Person.find({}).then((people) => {
    res
      .status(200)
      .send(
        `<p>Phonebook has info for ${people.length} people</p> ${new Date()}`
      );
  });
});

app.delete(`${personsEndpoint}/:id`, (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result === null) return res.status(204).end();
      return res.status(204).end();
    })
    .catch((err) => next(err));
});

app.post(personsEndpoint, (req, res, next) => {
  const newPerson = req.body;

  if (!newPerson.number || !newPerson.name) {
    return res.status(400).json({ error: 'Missing name and/or number fields' });
  }

  Person.create(newPerson)
    .then((createdPerson) => {
      return res.status(201).json(createdPerson);
    })
    .catch((err) => next(err));
});

app.put(`${personsEndpoint}/:id`, (req, res, next) => {
  const id = req.params.id;
  const update = req.body;

  Person.findByIdAndUpdate(id, update, { new: true })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      next(err);
    });
});

app.use(badIdHandler);

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
