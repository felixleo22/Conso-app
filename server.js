const express = require('express');

// Client routing
const client = require('./client');
const api = require('./api');

const app = express();

app.use('/', client);
app.use('/api', api);

app.use('/static', express.static('public'));

app.listen(8080, () => {
    console.log('Conso App server is running !');
});
