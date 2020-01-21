/* eslint-disable no-underscore-dangle */
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
                const product = doc || { _id: barcode, shops: [] };

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

router.put('/product/:code', (req, res) => {
    const { shop, price } = req.body;
    const barcode = req.params.code;
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    fetch(url)
        .then((data) => data.json())
        .then((json) => {
            if (json.status === 0) throw new Error(json.status_verbose);

            // TODO update shop prices
            const inputObj = { _id: shop, price };
            db.get('product').bulkWrite([{
                updateOne: {
                    filter: { _id: barcode, 'shops._id': inputObj._id },
                    update: { $set: { 'shops.$.price': inputObj.price } },
                },
            }, {
                updateOne: {
                    filter: { _id: barcode, 'shops._id': { $ne: inputObj._id } },
                    update: { $push: { shops: inputObj } },
                },
            }, {
                insertOne: {
                    document: {
                        _id: barcode,
                        shops: [inputObj],
                    },
                },
            // eslint-disable-next-line arrow-body-style
            }], () => {
                // TODO prendre en charge les erreurs
                return res.send('ok');
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

module.exports = router;
