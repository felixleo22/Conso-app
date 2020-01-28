/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const bodyparser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
const crypto = require('crypto');

// eslint-disable-next-line import/no-unresolved
const db = require('./lib/mongo');

const app = express();

// middleware
app.use(cors());
app.use(bodyparser.json());

// Routers
app.get('/', (req, res) => {
    res.json({ name: 'Conso App' });
});

// router to send barcode with price
app.get('/product/:code', (req, res) => {
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

app.put('/product/:code', (req, res) => {
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

app.post('/magasin', (req, res) => {
    const data = req.body;
    db.get('shops').insert(data);
    res.status(200).json({
        type: 'success',
        code: 200,
        content: data,
    });
});

app.post('/signIn', (req, res) => {
    const { email, password1, password2 } = req.body;
    db.get('user').findOne({ email }, (err, doc) => {
        if (doc) {
            return res.status(400).json(({ type: 'error', code: 400, message: 'Email déjà utilisé' }));
        }
        if (password1 !== password2) {
            return res.status(400).json(({ type: 'error', code: 400, message: 'Mot de passe différent' }));
        }
        db.get('user').insert({
            email,
            password: crypto.createHmac('sha512', password1).update('I love cupcakes').digest('hex'),
        }, (error, result) => {
            if (error) throw error;
            return res.status(201).json(({ type: 'success', code: 201, user: result }));
        });
    });
});

/* Errors and unknown routes */
app.all('*', (req, res) => res.status(400).json({ type: 'error', code: 400, message: 'bad request' }));
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => res.status(500).json({ type: 'error', code: 500, message: error.message }));

app.listen(8080, () => {
    console.log('Conso App API is running !');
    db.connect('mongodb://mongodb/ConsoApp', (err) => {
        if (err) {
            throw new Error(err);
        }
        console.log('Connected to database');
    });
});
