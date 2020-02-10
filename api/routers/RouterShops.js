const router = require('express').Router();

const Shop = require('../models/Shop');

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
    res.json({});
});

module.exports = router;
