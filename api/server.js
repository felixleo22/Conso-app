/* eslint-disable no-underscore-dangle */
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');

// routers
// const RouterProducts = require('./routers/RouterProducts');
const RouterShops = require('./routers/RouterShops');
const RouterUsers = require('./routers/RouterUsers');

// create app
const app = express();

// database
mongoose.connect('mongodb://mongodb/ConsoApp', {
    useNewUrlParser: true,
});

// middleware
app.use(cors());
app.use(bodyparser.json());

// Routers
app.get('/', (req, res) => {
    res.json({ name: 'Conso App' });
});

// app.use(RouterProducts);
app.use(RouterShops);
app.use(RouterUsers);


/* Errors and unknown routes */
app.all('*', (req, res) => res.status(400).json({ type: 'error', code: 400, message: 'bad request' }));
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    console.log(error);
    return res.status(500).json({ type: 'error', code: 500, message: error.message });
});

app.listen(8080, () => {
    console.log('Conso App API is running !');
});
