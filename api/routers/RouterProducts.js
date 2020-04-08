const router = require('express').Router();
const fetch = require('node-fetch');
const Auth = require('../utils/Auth');
const Price = require('../models/Price');


/**
 * @api {get} /product/:code get a product with barcode and a call to openfoodfacts
 * @apiName GetProductWithBarCode
 * @apiGroup Product
 *
 * @apiParam (URI) {Number} code Barcode of product
 *
 * @apiSuccess (201) {Product} product Return a product with all informations
 *
 * @apiError 400 Missing barcode
 * @apiError 404 the barcode does not exist
 * @apiError 500 Internal Server Error
 */
router.get('/product/:code', (req, res) => {
    const barcode = req.params.code;
    if (!barcode) {
        res.status(400).json(({ type: 'error', code: 400, message: 'Missin barcode' }));
        return;
    }
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
 *
 * @apiError 500 Internal Server Error
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
            throw error;
        });

// TODO prendre en compte les erreurs
});

/**
 * @api {get} /products/shop/publicBasket/ get prices of each product in public basket for each shop
 * @apiName GetPricesForEachProductForEachShop
 * @apiGroup Product
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiParam (Query) {Shops} Shops array of shop
 * @apiParam (list) {String} list of PublicBasket
 *
 * @apiSuccess (201) {Products} products Return 5 products with barcode, name, icon, brand
 *
 * @apiError 400 Missing shops of list
 * @apiError 401 Unauthorized
 * @apiError 500 Internal Server Error
 */
router.get('/products/shop/publicBasket/', (req, res) => {
    const { shops } = req.query;
    if (!shops) {
        res.status(400).json(({ type: 'error', code: 400, message: 'Missing shops' }));
        return;
    }
    const { list } = req.query;
    if (!list) {
        res.status(400).json(({ type: 'error', code: 400, message: 'Missing list' }));
        return;
    }
    const auth = req.headers.authorization;
    if (!auth) {
        res.status(401).json(({ type: 'error', code: 401, message: 'Unauthorized' }));
        return;
    }
    const listItem = JSON.parse(list);
    Auth(auth).then(() => {
        const items = [];
        shops.forEach(async (shop) => {
            const parsedShop = JSON.parse(shop);
            await listItem.items.forEach((priceList) => {
                Price.find({ shop: parsedShop._id, product: priceList.codebar }).then((price) => {
                    if (price.length > 0) {
                        items.push(price[0]);
                    } else {
                        const obj = {
                            items: priceList,
                            idShop: parsedShop._id,
                        };
                        items.push(obj);
                    }
                    if (items.length === (listItem.items.length) * (shops.length)) {
                        console.log(items);
                        res.status(200).json(items);
                    }
                });
            });
        });
    }).catch((error) => {
        const err = JSON.parse(error.message);
        return res.status(err.code).json(err);
    });
});
module.exports = router;
