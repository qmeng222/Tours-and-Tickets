// require modules:
const dotenv = require('dotenv');
// read variables from config.env file, and save them into Node.js environment variables:
dotenv.config({ path: './config.env' });

// require the app file AFTER the environment variables are read from the config.env file
// bc we can read the process variable inside app.js only if it was configured
const app = require('./app');

console.log(app.get('env')); // get the environment global varialbe --> development or production

// // log environment global variables:
// console.log(process.env);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
