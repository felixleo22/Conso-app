const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('home.html.twig');
});

router.get('/zinzin', (req, res) => {
    res.sendFile('./client/views/index.html', { root: '.' });
});

module.exports = router;
