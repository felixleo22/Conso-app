const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('home.html.twig');
});

router.get('/scan', (req, res) => {
    res.render('index.html.twig', { root: '.' });
});

router.get('/accueil', (req, res) => {
    res.render('accueil.html.twig', { root: '.' });
});

router.get('/connexion', (req, res) => {
    res.render('connexion.html.twig', { root: '.' });
});

router.get('/inscription', (req, res) => {
    res.render('inscription.html.twig', { root: '.' });
});

module.exports = router;
