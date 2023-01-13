// require modules:
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    // deprecation warnings:
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection is successful!'));

// read the JSON file (NOTE: when receiving data from a web server, the data is always a string, and we have to convert text into a JavaScript object):
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

// function to import data into database:
const importData = async () => {
  try {
    await Tour.create(tours); // The create method can accept an array of objects and creates a new document for each of the objects in the array
    console.log('🙌 Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// function to delete all data from collection:
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('✅ Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// console.log(process.argv);
// [
//   '/usr/local/bin/node',
//   '/Users/qingyingmeng/Desktop/side-projects/Tours-and-Tickets/dev-data/data/import-dev-data.js',
//   '--import'
// ];

// call function on conditions:
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
