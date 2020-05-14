/* eslint-disable no-param-reassign */
const router = require('express').Router();
const ShoppingList = require('../models/ShoppingList');
/**
 * @api {get} /shoppinglist get lists of shoppinglist of user
 * @apiName getShoppingList
 * @apiGroup shoppinglist
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiError 500 Internal Server Error
 *
 * @apiSuccess (200) {List} List Return List
 */
router.get('/shoppinglist', (req, res) => {
    if (!req.authUser) {
        res.status(401).json({ type: 'error', code: 401, message: 'Authentification required' });
        return;
    }
    const tab = [];
    ShoppingList.find({}, (err, shoppingLists) => {
        if (err) throw err;
        shoppingLists.forEach((shoppingList) => {
            if (String(shoppingList.user) === String(req.authUser._id)) {
                tab.push(shoppingList);
            }
        });
        res.status(200).json(tab);
    });
});

/**
 * @api {get} /shoppinglist/:idShoppingList get the list of shoppinglist of user whith id
 * @apiName getShoppingListById
 * @apiGroup shoppinglist
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiError 500 Internal Server Error
 *
 * @apiSuccess (200) {List} List Return List
 */
router.get('/shoppinglist/:idShoppingList', (req, res) => {
    const { idShoppingList } = req.params;
    if (!idShoppingList) {
        res.status(400).json({ type: 'error', code: 400, message: 'invalid idShoppingList' });
        return;
    }
    if (!req.authUser) {
        res.status(401).json({ type: 'error', code: 401, message: 'Authentification required' });
        return;
    }
    ShoppingList.findById(idShoppingList)
        .then((shoppingList) => res.status(200).json(shoppingList.list))
        .catch((err) => res.status(500).json(err));
});

/**
 * @api {post} /shoppinglist create a shoppingList
 * @apiName postShoppingList
 * @apiGroup shoppinglist
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiError 400 invalid name
 * @apiError 401 Unauthorized
 * @apiError 500 Internal Server Error
 *
 * @apiSuccess (200) {ShoppingList} List Return List
 */
router.post('/shoppinglist', (req, res) => {
    const { name } = req.body;
    if (!req.authUser) {
        res.status(401).json({ type: 'error', code: 401, message: 'Authentification required' });
        return;
    }
    const shoppingList = new ShoppingList({
        name,
        list: [],
        settings: {
            position: {
                lat: 48.5,
                lng: 0.5,
            },
            radius: 5,
        },
        user: req.authUser._id,
    });
    shoppingList.save((err, newShoppingList) => {
        if (err) throw err;
        return res.status(200).json(newShoppingList);
    });
});

/**
 * @api {patch} /shoppinglist add an item to the list of shoppingList
 * @apiName putShoppingList
 * @apiGroup shoppinglist
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiError 400 invalid quantity
 * @apiError 500 Internal Server Error
 *
 * @apiSuccess (200) {List} List Return List
 */
router.put('/shoppinglist/:idShoppingList', (req, res) => {
    const { idShoppingList } = req.params;
    if (!idShoppingList) {
        res.status(400).json({ type: 'error', code: 400, message: 'invalid idShoppingList' });
        return;
    }
    const data = req.body;
    if (!req.authUser) {
        res.status(401).json({ type: 'error', code: 401, message: 'Authentification required' });
        return;
    }
    if (!Number(data.quantity)) {
        res.status(400).json(({ type: 'error', code: 400, message: 'invalid quantity' }));
        return;
    }
    ShoppingList.findById(idShoppingList).then((shoppingList) => {
        const indexOfCodebar = shoppingList.list.findIndex(
            (item) => item.codebar.toString() === data.codebar,
        );
        if (indexOfCodebar >= 0) {
            shoppingList.list[indexOfCodebar].quantity += 1;
        } else {
            shoppingList.list.push(data);
        }
        shoppingList.save((error, newShoppingList) => {
            if (error) throw error;
            return res.status(200).json(newShoppingList.list);
        });
    });
});

/**
 * @api {put} /shoppinglist update an item to the list of shoppingList
 * @apiName putShoppingList
 * @apiGroup shoppinglist
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiError 400 invalid quantity
 * @apiError 500 Internal Server Error
 *
 * @apiSuccess (200) {List} List Return List
 */
router.patch('/shoppinglist/:idShoppingList', (req, res) => {
    const { idShoppingList } = req.params;
    if (!idShoppingList) {
        res.status(400).json({ type: 'error', code: 400, message: 'invalid idShoppingList' });
        return;
    }
    const data = req.body;
    if (!req.authUser) {
        res.status(401).json({ type: 'error', code: 401, message: 'Authentification required' });
        return;
    }
    if (!Number(data.quantity)) {
        res.status(400).json(({ type: 'error', code: 400, message: 'invalid quantity' }));
        return;
    }
    ShoppingList.findById(idShoppingList).then((shoppingList) => {
        shoppingList.list.find(
            (item) => item.codebar === data.codebar,
        ).quantity = data.quantity;
        shoppingList.save((error, newShoppingList) => {
            if (error) throw error;
            res.status(200).json(newShoppingList.list);
        });
    }).catch((err) => res.status(500).json(err));
});

/**
 * @api {delete} /shoppinglist delete an item to the list of shoppingList
 * @apiName deleteShoppingList
 * @apiGroup shoppinglist
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiError 400 invalid quantity
 * @apiError 500 Internal Server Error
 *
 * @apiSuccess (200) {List} List Return List
 */
router.delete('/shoppinglist/:idShoppingList', (req, res) => {
    const { idShoppingList } = req.params;
    if (!idShoppingList) {
        res.status(400).json({ type: 'error', code: 400, message: 'invalid idShoppingList' });
        return;
    }
    const data = req.body;

    if (!req.authUser) {
        res.status(401).json({ type: 'error', code: 401, message: 'Authentification required' });
        return;
    }
    ShoppingList.findById(idShoppingList).then((shoppingList) => {
        shoppingList.list = shoppingList.list.filter(
            (item) => item.codebar !== data.codebar,
        );
        shoppingList.save((error, newShoppingList) => {
            if (error) throw error;
            res.status(200).json(newShoppingList.list);
        });
    }).catch((err) => res.status(500).json(err));
});

/**
 * @api {post} /shoppinglist/settings update settings of shoppingList
 * @apiName UpdateSettingsShoppingList
 * @apiGroup shoppinglist
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiError 400 invalid radius or coordinates
 * @apiError 500 Internal Server Error
 *
 * @apiSuccess (200) {ShoppingList} ShoppingList Return ShoppingList
 */
router.post('/shoppinglist/settings', (req, res) => {
    const data = req.body;

    if (!req.authUser) {
        res.status(401).json({ type: 'error', code: 401, message: 'Authentification required' });
        return;
    }

    const user = req.authUser;
    if (!Number(data.radius)) {
        res.status(400).json(({ type: 'error', code: 400, message: 'invalid radius' }));
        return;
    }
    if (!Number(data.position.lat) || !Number(data.position.lat)) {
        res.status(400).json(({ type: 'error', code: 400, message: 'invalid coordinates' }));
        return;
    }
    user.shoppingList.settings = data;
    user.save((error, newUser) => {
        if (error) throw error;
        res.status(200).json(newUser.shoppingList);
    });
});

/**
 * @api {get} /shoppinglist/settings get settings of shoppingList
 * @apiName getSettingsOfShoppingList
 * @apiGroup shoppinglist
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiError 500 Internal Server Error
 *
 * @apiSuccess (200) {Settings} Settings Return Settings
 */
router.get('/shoppinglist/settings', (req, res) => {
    if (!req.authUser) {
        res.status(401).json({ type: 'error', code: 401, message: 'Authentification required' });
        return;
    }

    const user = req.authUser;

    res.status(200).json(user.shoppingList.settings);
});

module.exports = router;
