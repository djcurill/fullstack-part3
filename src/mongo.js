const mongoose = require('mongoose');
const { hideBin } = require('yargs/helpers');

const argv = require('yargs/yargs')(hideBin(process.argv)).usage(
  '$0 <password> [name] [number]',
  'PhoneNumber database cli for adding and retrieving contacts',
  (yargs) => {
    yargs
      .positional('password', {
        describe: 'password to phonebook database',
        type: 'string',
      })
      .positional('name', { describe: 'name of contact', type: 'string' })
      .positional('number', {
        describe: 'a phone number',
        type: 'string',
      });
  }
).argv;

mongoose
  .connect(
    `mongodb+srv://fullstack:${argv.password}@danocluster.kxoym.mongodb.net/phonebook?retryWrites=true&w=majority`
  )
  .catch((err) => console.log(err));

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const PhoneNumber = mongoose.model('Phonenumber', phoneSchema);

if (argv.name && argv.number) {
  // Add new number
  const newNumber = new PhoneNumber({
    name: argv.name,
    number: argv.number,
  });

  newNumber.save().then((res) => {
    console.log('New phonenumber saved.');
    mongoose.connection.close();
  });
} else {
  // Get all numbers
  PhoneNumber.find({}).then((result) => {
    console.log('Phonebook:');

    result.map((contact) => {
      console.log(contact.name + ' ' + contact.number);
    });

    mongoose.connection.close();
  });
}
