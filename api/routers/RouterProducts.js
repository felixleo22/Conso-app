const router = require('express').Router();
const fetch = require('node-fetch');

/**
 * @api {get} /product/:code get a product with barcode and a call to openfoodfacts
 * @apiName GetProductWithBarCode
 * @apiGroup Product
 *
 * @apiParam (URI) {Number} code Barcode of product
 *
 * @apiSuccess (201) {Product} product Return a product with all informations
 * @apiError 404 the barcode does not exist
 */
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

/**
 * @api {get} /product get 5 products with String and a call to openfoodfacts
 * @apiName Get5ProductsWithString
 * @apiGroup Product
 *
 * @apiParam (Query) {String} search String for research
 *
 * @apiSuccess (201) {Products} products Return 5 products with barcode, name, icon, brand
 */
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
            const array = json.products.slice(0, 5).map((elem) => ({
                codebar: elem.code,
                name: elem.product_name,
                icon: elem.image_thumb_url,
                brand: elem.brands,
            }));
            res.json({ products: array });
        }).catch((error) => {
            console.log(error);
            // throw error;
        });

// TODO prendre en compte les erreurs
});

module.exports = router;
