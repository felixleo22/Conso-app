const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Bienvenue sur Conso App !');
});

router.get('/zinzin', (req, res) => {
    res.sendFile('./client/views/index.html', { root: '.' });
});

module.exports = router;
