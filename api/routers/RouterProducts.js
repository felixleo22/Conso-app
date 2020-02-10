const router = require('express').Router();
const fetch = require('node-fetch');

router.get('/product/:code', (req, res) => {
    const barcode = req.params.code;
    const url = `https://fr.openfoodfacts.org/api/v0/product/${barcode}.json`;
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

router.get('/products', (req, res) => {
    const { search } = req.query;
    if (!search) {
        res.json({});
        return;
    }
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${search}&search_simple=1&json=1`;
    fetch(url)
        .then((data) => data.json())
        .then((json) => {
            res.json(json.products.slice(0, 5).map((elem) => ({
                code: elem.code,
                name: elem.product_name,
                icone: elem.image_thumb_url,
            })));
        });
});

module.exports = router;
