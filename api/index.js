const fetch = require('node-fetch');
const router = require('express').Router();
const db = require('../lib/mongo');

router.get('/', (req, res) => {
    res.send('L API de conso App fonctionne !');
});

router.get('/product/:code', (req, res) => {
    const barcode = req.params.code;
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    fetch(url)
        .then((data) => data.json())
        .then((json) => {
            if (json.status === 0) throw new Error(json.status_verbose);
            // FIXME cela ne s'insere pas
            db.product.insert({
                code: barcode,
                prix: 5,
            });
            res.send(json);
        })
        .catch((error) => {
            res.status(404).json({
                type: 'error',
                error: 404,
                message: error.message,
            });
        });
});

module.exports = router;
