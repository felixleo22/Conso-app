const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Auth = require('../utils/Auth');
const PublicBasket = require('../models/PublicBasket');

router.get('/publicBasketOfUser/:id', (req, res) => {
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

module.exports = router;
