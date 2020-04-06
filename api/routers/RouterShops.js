/* eslint-disable no-param-reassign */
const router = require('express').Router();
const geolib = require('geolib');

const Shop = require('../models/Shop');
const Price = require('../models/Price');

const Auth = require('../utils/Auth');


router.get('/shop/:id', (req, res) => {
    const shopId = req.params.id;
    Shop.findById(shopId, (err, shop) => {
        if (err) throw err;

        if (!shop) return res.json({ type: 'error', code: 404, message: 'Shop not found' });

        return res.json(shop);
    });
});

// create a new shop
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

// Update price of a product in a shop (need auth)
router.put('/shop/:idShop/product/:barCodeProduct', (req, res) => {
    const auth = req.headers.authorization;

    Auth(auth).then((user) => {
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
    }).catch((error) => {
        const err = JSON.parse(error.message);
        res.status(err.code).json(err);
    });
});

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
                return dist <= req.query.radius;
            });
        }
        res.json(tab);
    });
});

module.exports = router;
