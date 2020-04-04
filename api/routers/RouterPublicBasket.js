const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Auth = require('../utils/Auth');
const PublicBasket = require('../models/PublicBasket');

router.post('/publicBasket', (req, res) => {
    const auth = req.headers.authorization;
    // eslint-disable-next-line consistent-return
    Auth(auth).then((user) => {
        if (user.shoppingList.list.length === 0) {
            res.status(400).json({ type: 'error', code: 400, message: 'Empty list' });
            return;
        }
        if (user.shoppingList.settings.radius === 0) {
            res.status(400).json({ type: 'error', code: 400, message: 'Empty settings' });
            return;
        }
        const shoppingListUser = user.shoppingList.list;
        const settingPublicBasket = user.shoppingList.settings;
        const publicBasket = new PublicBasket({
            shoppingList: {
                list: shoppingListUser,
                settings: settingPublicBasket,
            },
        });
        // expiration token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            'test',
            { expiresIn: '100000' },
        );
        publicBasket.expiredToken = token;
        // token user
        publicBasket.user = user._id;
        publicBasket.save((err, publicB) => {
            if (err) throw err;
            return res.status(200).json(publicB);
        });
    }).catch((error) => {
        const err = JSON.parse(error.message);
        return res.status(err.code).json(err);
    });
});

router.get('/publicBasket/:id', (req, res) => {
    const auth = req.headers.authorization;
    Auth(auth).then((user) => {
        PublicBasket.findById({}, (err, publicBasket) => {
            if (err) throw err;
            if (publicBasket.user !== user._id) {
                res.status(401).json({ type: 'error', message: 'Not authorized' });
            }
            jwt.verify(publicBasket.expiredToken, 'test', (err2, decoded) => {
                if (err2) {
                    PublicBasket.findByIdAndDelete(publicBasket._id);
                    res.status(500).json(err2);
                } if (decoded) {
                    res.status(200).json(publicBasket);
                }
            });
        });
    });
});

router.get('/publicBasket', (req, res) => {
    const idUser = req.body.id;
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
router.get('/publicBasket/settings/:id', (req, res) => {
    const auth = req.headers.authorization;
    Auth(auth).then((user) => {
        const { id } = req.params;
        PublicBasket.findById(id).then((basket) => {
            if (basket.user !== user._id) {
                res.status(401).json({ type: 'error', message: 'Not authorized' });
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
