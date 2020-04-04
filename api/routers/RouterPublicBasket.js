const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Auth = require('../utils/Auth');
const PublicBasket = require('../models/PublicBasket');

router.post('/publicBasket', (req, res) => {
    const auth = req.headers.authorization;
    Auth(auth).then((user) => {
        if (user.shoppingList.list.length === 0) {
            res.status(400).json({ type: 'error', code: 400, message: 'Empty list' });
        }
        if (user.shoppingList.settings.radius === 0) {
            res.status(400).json({ type: 'error', code: 400, message: 'Empty settings' });
        }
        const publicBasket = new PublicBasket({
            shoppingList: user.shoppingList,
        });
        // expiration token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            'test',
            { expiresIn: '100000' },
        );
        publicBasket.expiredToken = token;
        // token user
        publicBasket.user = auth;
        publicBasket.save((err, publicB) => {
            if (err) throw err;
            res.status(200).json(publicB);
        });
    }).catch((error) => {
        const err = JSON.parse(error.message);
        res.status(err.code).json(err);
    });
});

router.get('/publicBasket', (req, res) => {
    const auth = req.headers.authorization;
    const publicBasketReturn = [];
    Auth(auth).then(() => {
        PublicBasket.find({}, (err, publicBasket) => {
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


module.exports = router;
