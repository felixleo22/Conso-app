const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Auth = require('../utils/Auth');
const PublicBasket = require('../models/PublicBasket');

/**
 * @api {post} /publicBasket make a private shopping list on public basket
 * @apiName PostPublicBasket
 * @apiGroup publicBasket
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiSuccess (201) {PublicBasket} PublicBasket Return PublicBasket
 */
router.post('/publicBasket', (req, res) => {
    const auth = req.headers.authorization;
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

/**
 * @api {get} /publicBaskets get all publicBasket where the token has not expired
 * @apiName getPublicBasket
 * @apiGroup publicBasket
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiSuccess (201) {PublicBasket} PublicBasket Return PublicBasket
 */
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

/**
 * @api {get} /publicBasket/:idBasket get publicBasket with the id
 * @apiName getPublicBasketWithId
 * @apiGroup publicBasket
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiError 404 idBasket does not exist
 * @apiSuccess (201) {PublicBasket} PublicBasket Return PublicBasket
 */
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

/**
 * @api {get} /publicBasket/:idBasket/settings get settings of publicBasket
 * with the id where the token has not expired
 * @apiName getSettingsOfPublicBasketWithId
 * @apiGroup publicBasket
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiError 404 idBasket does not exist
 * @apiSuccess (201) {Settings} Setting Return Settings of publicBasket
 */
router.get('/publicBasket/:idBasket/settings', (req, res) => {
    const auth = req.headers.authorization;
    const { idBasket } = req.params;
    Auth(auth).then(() => {
        // eslint-disable-next-line max-len
        PublicBasket.findById(idBasket).then((publicBasket) => res.status(200).json(publicBasket.shoppingList.settings))
            .catch((err) => res.status(500).json(err));
    }).catch((error) => {
        const err = JSON.parse(error.message);
        return res.status(err.code).json(err);
    });
});


module.exports = router;
