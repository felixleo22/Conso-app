/* eslint-disable no-underscore-dangle */
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const RouterShops = require('./routers/RouterShops');

// create app
const app = express();

// database
mongoose.connect('mongodb://mongodb/ConsoApp', {
    useNewUrlParser: true,
});

// middleware
app.use(cors());
app.use(bodyparser.json());

// Routers
app.get('/', (req, res) => {
    res.json({ name: 'Conso App' });
});

app.use(RouterShops);


app.post('/magasin', (req, res) => {
    const data = req.body;
    db.get('shops').insert(data);
    res.status(200).json({
        type: 'success',
        code: 200,
        content: data,
    });
});

// TODO change in router
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
});
