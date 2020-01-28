const express = require('express');
const twig = require('twig');


const app = express();

// App setting
app.set('views', './views/');
app.set('view engine', 'html');
// eslint-disable-next-line no-underscore-dangle
app.engine('html', twig.__express);

// Router
app.get('/', (req, res) => {
    res.render('home.html.twig');
});

app.get('/scan', (req, res) => {
    res.sendFile('./views/index.html', { root: '.' });
});


app.use('/static', express.static('public'));

app.listen(8080, () => {
    console.log('Conso App client is running !');
});
