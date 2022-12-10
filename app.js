// 1. include modules (require):
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 2. middlewares:
app.use(express.json()); // data from the body is added to the request object
app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log('Hello from the middleware👋');
  next(); // at the end of each middleware function, a next function is called
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// 3. route handlers:
const createTour = (req, res) => {
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
};

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours: tours },
  });
};

const getTour = (req, res) => {
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
};

const updateTour = (req, res) => {
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
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }

  // show that the deleted resource now no longer exists, 204 means no content:
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// 4. routes | group the routes for convenience of changing the version or resource name:
app.route('/api/v1/tours').post(createTour).get(getAllTours);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// 5. start server:
const port = 3000;
app.listen(port, () => {
  console.log('App is running on port ${port}...');
});
