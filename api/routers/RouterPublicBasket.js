const router = require('express').Router();
const jwt = require('jsonwebtoken');
const PublicBasket = require('../models/PublicBasket');

/**
 * @api {post} /publicBasket make a private shopping list on public basket
 * @apiName PostPublicBasket
 * @apiGroup publicBasket
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiError 400 Empty list or settings
 * @apiError 500 Internal Server Error
 * @apiSuccess (201) {PublicBasket} PublicBasket Return PublicBasket
 */
router.post('/publicBasket', (req, res) => {
    if (!req.authUser) {
        res.status(201).json({ type: 'error', code: 401, message: 'Authentification required' });
        return;
    }

    const user = req.authUser;
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
});

/**
 * @api {get} /publicBaskets get all publicBasket where the token has not expired
 * @apiName getPublicBaskets
 * @apiGroup publicBasket
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiError 500 Internal Server Error
 *
 * @apiSuccess (201) {PublicBasket} PublicBasket Return PublicBasket
 */
router.get('/publicBaskets', (req, res) => {
    if (!req.authUser) {
        res.status(201).json({ type: 'error', code: 401, message: 'Authentification required' });
        return;
    }

    const tab = [];
    PublicBasket.find({}, (err, publicBasket) => {
        if (err) throw err;
        publicBasket.forEach((pb) => {
            jwt.verify(pb.expiredToken, 'test', (err2, decoded) => {
                if (err2) {
                    PublicBasket.findByIdAndDelete(pb._id);
                } if (decoded) {
                    tab.push(pb);
                }
            });
        });
        res.status(200).json(tab);
    });
});

/**
 * @api {get} /publicBasket/:idBasket get publicBasket with idBasket
 * @apiName getPublicBasketWithId
 * @apiGroup publicBasket
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiError 400 invalid idBasket
 * @apiError 500 Internal Server Error
 *
 * @apiSuccess (201) {PublicBasket} PublicBasket Return PublicBasket
 */
router.get('/publicBasket/:idBasket', (req, res) => {
    const { idBasket } = req.params;
    if (!idBasket) {
        res.status(400).json({ type: 'error', code: 400, message: 'invalid idBasket' });
        return;
    }
    if (!req.authUser) {
        res.status(201).json({ type: 'error', code: 401, message: 'Authentification required' });
        return;
    }
    PublicBasket.findById(idBasket).then((publicBasket) => res.status(200).json(publicBasket))
        .catch((err) => res.status(500).json(err));
});

/**
 * @api {get} /publicBasket/:idBasket/settings get settings of publicBasket with idBasket
 * where the token has not expired
 * @apiName getSettingsOfPublicBasketWithId
 * @apiGroup publicBasket
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiError 400 invalid idBasket
 * @apiSuccess (201) {Settings} Setting Return Settings of publicBasket
 */
router.get('/publicBasket/:idBasket/settings', (req, res) => {
    const { idBasket } = req.params;
    if (!idBasket) {
        res.status(400).json({ type: 'error', code: 400, message: 'invalid idBasket' });
        return;
    }
    if (!req.authUser) {
        res.status(201).json({ type: 'error', code: 401, message: 'Authentification required' });
        return;
    }
    // eslint-disable-next-line max-len
    PublicBasket.findById(idBasket).then((publicBasket) => res.status(200).json(publicBasket.shoppingList.settings))
        .catch((err) => res.status(500).json(err));
});

/**
 * @api {get} /publicBaskets/user get publicBaskets of user
 * @apiName getPublicBasketOfUser
 * @apiGroup publicBasket
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiSuccess (201) {publicBasketsOfUser} publicBasketsOfUser Return publicBasketsOfUser
 */
router.get('/publicBaskets/user', (req, res) => {
    const publicBasketReturn = [];
    if (!req.authUser) {
        res.status(201).json({ type: 'error', code: 401, message: 'Authentification required' });
        return;
    }
    const user = req.authUser;
    PublicBasket.find({ user: user._id }, (err, publicBasket) => {
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

/**
 * @api {get} /publicBasket/settings/:idBasket/user/:idUser get settings of public basket
 * with the id where the token has not expired
 * @apiName getSettingOfPublicBasketOfUserWithId
 * @apiGroup publicBasket
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiError 400 invalid idBasket
 * @apiSuccess (201) {Settings} Setting Return Settings of publicBasketsOfUser
 */
router.get('/publicBasket/settings/:idBasket/user', (req, res) => {
    const { idBasket } = req.params;
    if (!idBasket) {
        res.status(400).json({ type: 'error', code: 400, message: 'invalid idBasket' });
        return;
    }
    if (!req.authUser) {
        res.status(201).json({ type: 'error', code: 401, message: 'Authentification required' });
        return;
    }
    const user = req.authUser;
    PublicBasket.findById(idBasket).then((basket) => {
        if (String(basket.user) !== String(user._id)) {
            res.status(401).json({ type: 'error', message: 'Not authorized' });
            return;
        }
        res.status(200).json(basket.shoppingList.settings);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

/**
 * @api {delete} /publicBasket/:id/user delete publicBasketOfUser with the id
 * @apiName deletePublicBasketOfUserWithId
 * @apiGroup publicBasket
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiError 404 id does not exist
 * @apiSuccess (201) {publicBasketsOfUser} publicBasketsOfUser Return publicBasketsOfUser
 */
router.delete('/publicBasket/:id/user', (req, res) => {
    const idBasket = req.params.id;
    if (!idBasket) {
        res.status(400).json({ type: 'error', code: 401, message: 'Missing id' });
        return;
    }
    if (!req.authUser) {
        res.status(201).json({ type: 'error', code: 401, message: 'Authentification required' });
        return;
    }
    const user = req.authUser;
    PublicBasket.findById(idBasket).then((publicBasket) => {
        console.log(publicBasket.user);
        console.log(user._id);
        if (String(publicBasket.user) !== String(user._id)) {
            res.status(401).json({ status: 401, msg: 'Not Autorized' });
            return;
        }
        PublicBasket.findByIdAndDelete(publicBasket._id).then(() => {
            res.status(200).json(publicBasket);
        });
    });
});
module.exports = router;
