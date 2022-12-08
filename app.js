const fs = require('fs');
const express = require('express');

const app = express();

// // GET:
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Tours & Tickets' });
// });

// // POST:
// app.post('/', (req, res) => {
//   res.send('We can post to this endpoint...');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
// console.log(tours);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours: tours },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log('App is running on port ${port}...');
});
