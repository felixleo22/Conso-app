/* eslint-disable no-param-reassign */
const router = require('express').Router();

const Shop = require('../models/Shop');
const Price = require('../models/Price');

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

router.put('/shop/:idShop/product/:barCodeProduct', (req, res) => {
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
            });

            createdPrice.save(err, (err2, newPrice) => {
                if (err2) throw err2;
                res.json(newPrice);
            });
            return;
        }

        price.price = priceValue;
        price.updated_at = new Date();

        price.save((err2, newPrice) => {
            if (err2) throw err2;
            res.json(newPrice);
        });
    });
});

router.get('/shops', (req, res) => {
    const marker1 = req.query.NW.split(',');
    const marker2 = req.query.SE.split(',');
    Shop.find({
        'position.lng': { $gt: marker2[0], $lt: marker1[0] },
        'position.lat': { $gt: marker1[1], $lt: marker2[1] },
    }, (error, result) => {
        const shops = {
            shops: result,
        };
        res.json(shops);
    });
});

module.exports = router;
