const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Auth = require('../utils/Auth');
const PublicBasket = require('../models/PublicBasket');

router.post('/publicBasket', (req, res) => {
    const auth = req.headers.authorization;
    const tokenSplited = auth.split(' ');
    Auth(tokenSplited[1]).then((user) => {
        const shoppingListUser = user.shoppingList;
        const publicBasket = new PublicBasket({
            shoppingList: shoppingListUser,
        });
        const token = jwt.sign(
            { id: user._id, email: user.email },
            'test',
            { expiresIn: '100000' },
        );
        publicBasket.expiredToken = token;
        // eslint-disable-next-line prefer-destructuring
        publicBasket.user = tokenSplited[1];
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
    const tokenSplited = auth.split(' ');
    console.log(tokenSplited[1]);
    const publicBasketReturn = [];
    Auth(tokenSplited[1]).then(() => {
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

router.post('/publicBasket/product/:id', (req) => {
    const auth = req.headers.authorization;
    const tokenSplited = auth.split(' ');
    console.log(tokenSplited[1]);
});


module.exports = router;
