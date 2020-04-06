const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Auth = require('../utils/Auth');
const PublicBasket = require('../models/PublicBasket');

router.get('/publicBasketsOfUser/:id', (req, res) => {
    const idUser = req.params.id;
    if (!idUser) {
        res.status(400).json({ type: 'error', code: 401, message: 'Missing id' });
        return;
    }
    const auth = req.headers.authorization;
    const publicBasketReturn = [];
    Auth(auth).then(() => {
        PublicBasket.find({ user: idUser }, (err, publicBasket) => {
            if (err) throw err;
            publicBasket.forEach((pb) => {
                jwt.verify(pb.expiredToken, 'test', (err2, decoded) => {
                    if (err2) {
                        PublicBasket.findByIdAndDelete(publicBasket._id);
                    }
                    if (decoded) {
                        publicBasketReturn.push(pb);
                    }
                });
            });
            res.status(200).json(publicBasketReturn);
        });
    });
});

// TODO if with put /publicBasketsOfUser/settings/:id that doesn't work
router.get('/aladin/:id', (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ type: 'error', code: 401, message: 'Missing id' });
        return;
    }
    const auth = req.headers.authorization;
    Auth(auth).then((user) => {
        PublicBasket.findById(id).then((basket) => {
            if (String(basket.user) !== String(user._id)) {
                res.status(401).json({ type: 'error', message: 'Not authorized' });
                return;
            }
            res.status(200).json(basket.shoppingList.settings);
        }).catch((err) => {
            res.status(500).json(err);
        });
    }).catch((error) => {
        const err = JSON.parse(error.message);
        res.status(err.code).json(err);
    });
});

module.exports = router;
