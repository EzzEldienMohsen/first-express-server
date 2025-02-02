require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const tasks = require('./api/v1/tasks');
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

app.use(express.static('./public'));

app.get('/hello', (req, res) => {
  res.status(200).send('Task Manager App');
});
app.use('/api/v1/tasks', tasks);

app.use(notFound);
app.use(errorHandlerMiddleware);
app.listen(port, () => {
  console.log(`server is up and running on port ${port}`);
});
