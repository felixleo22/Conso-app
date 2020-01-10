const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('home.html.twig');
});

router.get('/scan', (req, res) => {
    res.sendFile('./client/views/index.html', { root: '.' });
});

router.get('/accueil', (req, res) => {
    res.sendFile('./client/views/accueil.html', { root: '.' });
});

router.get('/connexion', (req, res) => {
    res.sendFile('./client/views/connexion.html', { root: '.' });
});

router.get('/inscription', (req, res) => {
    res.sendFile('./client/views/inscription.html', { root: '.' });
});

module.exports = router;
