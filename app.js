const express = require('express');
const app = express();

const drawRoutes = require('./routes/drawRoutes');

module.exports =app;

app.use(require('morgan')('dev'));
app.use(require('cors')());

app.use('/draw', drawRoutes)