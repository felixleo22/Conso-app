const router = require('express').Router();
const fetch = require('node-fetch');

router.get('/product/:code', (req, res) => {
    const barcode = req.params.code;
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    fetch(url)
        .then((data) => data.json())
        .then((json) => {
            if (json.status === 0) throw new Error(json.status_verbose);
            const offProduct = json.product;
            res.send(offProduct);
        })
        .catch((error) => {
            res.status(404).json({
                typea: 'error',
                error: 404,
                message: error.message,
            });
        });
});

module.exports = router;
