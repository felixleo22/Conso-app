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

router.get('/products/shop/publicBasket/', (req, res) => {
    const shopsItem = req.query.shops;
    const { list } = req.query;
    const listItem = JSON.parse(list);
    const auth = req.headers.authorization;
    Auth(auth).then(() => {
        const items = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const shop of shopsItem) {
            const parsedShop = JSON.parse(shop);
            // eslint-disable-next-line no-restricted-syntax
            for (const priceList of listItem.items) {
                console.log(parsedShop);
                // eslint-disable-next-line max-len,no-inner-declarations
                async function zinzin(priceList1, parsedShop1) {
                    // eslint-disable-next-line max-len,no-return-await,consistent-return
                    return await Price.find({ shop: parsedShop1._id, product: priceList1.codebar }).then((price) => {
                        if (price.length > 0) {
                            return price[0];
                        }
                        if (price.length === 0) {
                            // eslint-disable-next-line no-param-reassign
                            priceList1.shop = parsedShop1._id;
                            return priceList1;
                        }
                    });
                }
                zinzin(priceList, parsedShop).then((price) => {
                    items.push(price);
                    if (items.length === (listItem.items.length) * (shopsItem.length)) {
                        console.log(items);
                        res.status(200).json(items);
                    }
                });
            }
        }
    }).catch((error) => {
        const err = JSON.parse(error.message);
        return res.status(err.code).json(err);
    });
});
module.exports = router;
