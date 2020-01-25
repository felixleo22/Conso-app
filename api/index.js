/* eslint-disable no-underscore-dangle */
const fetch = require('node-fetch');
const router = require('express').Router();
const bodyParser = require('body-parser');
const db = require('../lib/mongo');

router.use(bodyParser.json());

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
            }], (result) => {
                if (!result.result.ok) {
                    throw new Error("Can't create or update this product");
                }
                return res.status(204).send('ok');
            });
        })
        .catch((error) => {
            throw new Error(`Cant update this product : ${error.message}`);
        });
});

router.post('/magasin', (req, res) => {
    const data = req.body;
    db.get('shops').insert(data);
    res.status(200).json({
        type: 'success',
        code: 200,
        content: data,
    });
});

/* Errors and unknown routes */
router.all('*', (req, res) => res.status(400).json({ type: 'error', code: 400, message: 'bad request' }));
// eslint-disable-next-line no-unused-vars
router.use((error, req, res, next) => res.status(500).json({ type: 'error', code: 500, message: error.message }));

module.exports = router;
