require('dotenv').config();
const mongoose = require('mongoose');
const { hideBin } = require('yargs/helpers');
const Person = require('./models/person');

mongoose.connect(process.env.MONGODB_URI).catch((err) => console.log(err));

// eslint-disable-next-line import/order
const { argv } = require('yargs/yargs')(hideBin(process.argv)).usage(
  '$0 [name] [number]',
  'PhoneNumber database cli for adding and retrieving contacts',
  (yargs) => {
    yargs
      .positional('name', { describe: 'name of contact', type: 'string' })
      .positional('number', {
        describe: 'a phone number',
        type: 'string',
      });
  }
);

if (argv.name && argv.number) {
  // Add new number
  const newNumber = new Person({
    name: argv.name,
    number: argv.number,
  });

  newNumber.save().then((res) => {
    console.log('New phonenumber saved.');
    mongoose.connection.close();
  });
} else {
  // Get all numbers
  Person.find({}).then((result) => {
    console.log('Phonebook:');

    // eslint-disable-next-line array-callback-return
    result.map((person) => {
      console.log(`${person.name} ${person.number}`);
    });

    mongoose.connection.close();
  });
}
