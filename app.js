const express = require('express');

const app = express();

// GET:
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'Tours & Tickets' });
});

// POST:
app.post('/', (req, res) => {
  res.send('We can post to this endpoint...');
});

const port = 3000;
app.listen(port, () => {
  console.log('App is running on port ${port}...');
});
