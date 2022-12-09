const fs = require('fs');
const express = require('express');

const app = express();
// use the middleware: the data from the body is added to the request object:
app.use(express.json());

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

// POST:
app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      //  201 means created:
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

// GET all:
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours: tours },
  });
});

// GET a specific:
app.get('/api/v1/tours/:id', (req, res) => {
  // console.log(req.params);
  // // 👆get {id: '5', x: '23', y: undefined} for '/api/v1/tours/:id/:x:y?'

  const id = req.params.id * 1; // str --> num
  const tour = tours.find((el) => el.id === id);

  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tours: tour },
  });
});

// PATCH:
app.patch('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour: '<udated tour here...>' },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log('App is running on port ${port}...');
});
