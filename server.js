// server.js is the entry point

// require modules:
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  // console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  // console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

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

const port = process.env.PORT || 3000;
hostname = '0.0.0.0';
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});

// example error, wrong DATABASE_PASSWORD:
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...'); // shut down application
  console.log(err.name, err.message);
  // close the server (give the server some time to finish all all running or pending requests), and then run the callback function to immediately abort all running or pending requests:
  server.close(() => {
    process.exit(1); // 0 stands for a success, and 1 stands for uncaught exception
  });
});
