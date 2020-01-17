const fetch = require('node-fetch');
const router = require('express').Router();
const bodyParser = require('body-parser');
// eslint-disable-next-line import/no-unresolved
const db = require('./lib/mongo');

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
            // FIXME cela ne s'insere pas
            db.get('products').insert({
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


// router to see all of bdd
router.get('/bdd', (req, res) => {
    db.get('magasin').find().toArray((result) => {
        res.json(result);
    });
});

router.post('/:magasin', (req, res) => {
    if (req.params.magasin !== 'magasin') {
        res.status(400).json({
            type: 'error',
            error: 400,
            message: 'Route non connue',
        });
    } else {
        const data = req.body;
        db.get('shops').insert(data);
        res.status(200).json({
            type: 'success',
            code: 200,
            content: data,
        });
    }
});

module.exports = router;
