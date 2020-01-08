const express = require('express');

// Client routing
const client = require('./client');
// API routing
const api = require('./api');

const app = express();

// App setting
app.configure(() => {
    // Twig settings
    app.set('views', `${__dirname}/client/views`);
    app.set('view engine', 'twig');
});

app.use('/', client);
app.use('/api', api);

app.use('/static', express.static('public'));

app.listen(8080, () => {
    console.log('Conso App server is running !');
});
