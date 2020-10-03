/* eslint-disable no-param-reassign */
const router = require('express').Router();
const geolib = require('geolib');

const Shop = require('../models/Shop');
const Price = require('../models/Price');

/**
 * @api {get} /shop/:id get shop by id
 * @apiName getShopById
 * @apiGroup shop
 *
 * @apiError 400 invalid idShop
 * @apiError 500 Internal Server Error
 *
 * @apiSuccess (200) {Shop} Shop Return Shop
 */
router.get('/shop/:id', (req, res) => {
    const shopId = req.params.id;
    if (!shopId) {
        res.status(400).json(({ type: 'error', code: 400, message: 'invalid idShop' }));
        return;
    }
    Shop.findById(shopId, (err, shop) => {
        if (err) throw err;

        if (!shop) return res.json({ type: 'error', code: 404, message: 'Shop not found' });

        return res.json(shop);
    });
});

/**
 * @api {post} /shop create a new shop
 * @apiName postShop
 * @apiGroup shop
 *
 * @apiError 400 missing data
 * @apiError 500 Internal Server Error
 *
 * @apiSuccess (201) {Shop} Shop Return Shop
 */
router.post('/shop', (req, res) => {
    const data = req.body;

    if (!data.name || !data.address || !data.position) {
        res.status(400).json({ type: 'error', code: 400, message: 'Missing data' });
        return;
    }
    const shop = new Shop(data);
    shop.save((err) => {
        if (err) {
            throw err;
        }
        res.status(201).send(shop);
    });
});

/**
 * @api {put} /shop/:id create a new shop
 * @apiName putShop
 * @apiGroup shop
 *
 * @apiError 400 missing data
 * @apiError 500 Internal Server Error
 *
 * @apiSuccess (200) {Shop} Shop Return Shop
 */
router.put('/shop/:id', (req, res) => {
    const shopId = req.params.id;
    const data = req.body;

    if (!data.name || !data.address || !data.position) {
        res.status(400).json({ type: 'error', code: 400, message: 'Missing data' });
        return;
    }

    Shop.findByIdAndUpdate(shopId, data, (err, shop) => {
        if (err) throw err;

        if (!shop) {
            const newShop = new Shop(data);
            newShop._id = shopId;
            newShop.save((err2) => {
                if (err2) throw err;

                return res.status(201).json(newShop);
            });
        }
        return res.json(shop);
    });
});

/**
 * @api {get} /shop/:idShop/product/:barCodeProduct get price a product of one shop
 * @apiName getPriceProductOfShop
 * @apiGroup shop
 *
 * @apiError 400 missing data
 * @apiError 500 Internal Server Error
 *
 * @apiSuccess (200) {Price} Price Return Price
 */
router.get('/shop/:idShop/product/:barCodeProduct', (req, res) => {
    const barcode = req.params.barCodeProduct;
    const shop = req.params.idShop;

    Price.findOne({ shop, product: barcode }, (err, price) => {
        if (err) throw err;

        if (!price) {
            res.status(404).json({ type: 'error', code: 404, message: 'Not found' });
            return;
        }

        res.json(price);
    });
});

/**
 * @api {put} /shop/:idShop/product/:barCodeProduct Update price of a product in a shop
 * @apiName putPriceProductOfShop
 * @apiGroup shop
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiError 400 missing data
 * @apiError 500 Internal Server Error
 *
 * @apiSuccess (200) {Price} Price Return Price
 */
router.put('/shop/:idShop/product/:barCodeProduct', (req, res) => {
    if (!req.authUser) {
        res.status(401).json({ type: 'error', code: 401, message: 'Authentification required' });
        return;
    }

    const user = req.authUser;

    const barcode = req.params.barCodeProduct;
    const shop = req.params.idShop;
    const priceValue = req.body.price;

    Price.findOne({ shop, product: barcode }, (err, price) => {
        if (err) throw err;

        if (!price) {
            const createdPrice = new Price({
                shop,
                product: barcode,
                price: priceValue,
                updated_at: new Date(),
                updated_by: user._id,
            });

            createdPrice.save(err, (err2, newPrice) => {
                if (err2) throw err2;
                res.json(newPrice);
            });
            return;
        }

        price.price = priceValue;
        price.updated_at = new Date();
        price.updated_by = user._id;

        price.save((err2, newPrice) => {
            if (err2) throw err2;
            res.json(newPrice);
        });
    });
});

/**
 * @api {get} /shops get shops
 * @apiName getShops
 * @apiGroup shop
 *
 * @apiError 500 Internal Server Error
 *
 * @apiSuccess (200) {Shops} Shops Return Shops
 */
router.get('/shops', (req, res) => {
    let query = Shop.find();
    // filter by bounds
    if (req.query.NW && req.query.SE) {
        const marker1 = req.query.NW.split(',');
        const marker2 = req.query.SE.split(',');
        const latMin = marker2[0];
        const latMax = marker1[0];
        const lngMin = marker1[1];
        const lngMax = marker2[1];
        query = query.where('position.lng').gt(lngMin).lt(lngMax);
        query = query.where('position.lat').gt(latMin).lt(latMax);
    }
    // filter when inside circle
    query.exec((error, result) => {
        const tab = {
            shops: result,
        };
        console.log(result);
        if (req.query.position && req.query.radius) {
            const position = req.query.position.split(',');
            tab.shops = tab.shops.filter((elem) => {
                const dist = geolib.getDistance({
                    latitude: Number(elem.position.lat),
                    longitude: Number(elem.position.lng),
                }, {
                    latitude: Number(position[0]),
                    longitude: Number(position[1]),
                });
                return dist <= req.query.radius * 1000;
            });
        }
        res.json(tab);
    });
});

module.exports = router;
