const fetch = require('node-fetch');
const router = require('express').Router();
const db = require('../lib/mongo');

router.get('/', (req, res) => {
    res.send('L API de conso App fonctionne !');
});

// router to send barcode with price
router.get('/product/:code', (req, res) => {
    const barcode = req.params.code;
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    fetch(url)
        .then((data) => data.json())
        .then((json) => {
            if (json.status === 0) throw new Error(json.status_verbose);

            db.get('product').findOne({ _id: barcode }, (err, doc) => {
                const product = doc || { _id: barcode, shop: [] };

                product.data = json.product;

                res.send(product);
            });
        })
        .catch((error) => {
            res.status(404).json({
                type: 'error',
                error: 404,
                message: error.message,
            });
        });
});

// router to see all of bdd
router.get('/bdd', (req, res) => {
    db.get('products').findOne({}, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
});

module.exports = router;
