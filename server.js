const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Bienvenue sur la page Conso App');
});

app.listen(8080, () => {
    console.log('Conso App server is running !');
});
