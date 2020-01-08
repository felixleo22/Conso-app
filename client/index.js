const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Bienvenue sur Conso App !');
});

module.exports = router;
