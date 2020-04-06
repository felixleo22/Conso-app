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
            { expiresIn: '10000000' },
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

router.get('/publicBaskets', (req, res) => {
    const auth = req.headers.authorization;
    Auth(auth).then(() => {
        const tab = [];
        PublicBasket.find({}, (err, publicBasket) => {
            if (err) throw err;
            publicBasket.forEach((pb) => {
                jwt.verify(pb.expiredToken, 'test', (err2, decoded) => {
                    if (err2) {
                        PublicBasket.findByIdAndDelete(pb._id).then(() => {
                            console.log('deleted');
                        });
                    } if (decoded) {
                        tab.push(pb);
                    }
                });
            });
            res.status(200).json(tab);
        });
    }).catch((error) => {
        const err = JSON.parse(error.message);
        return res.status(err.code).json(err);
    });
});

router.get('/publicBasket/:idBasket', (req, res) => {
    const auth = req.headers.authorization;
    const { idBasket } = req.params;
    Auth(auth).then(() => {
        PublicBasket.findById(idBasket).then((publicBasket) => res.status(200).json(publicBasket))
            .catch((err) => res.status(500).json(err));
    }).catch((error) => {
        const err = JSON.parse(error.message);
        return res.status(err.code).json(err);
    });
});


module.exports = router;
