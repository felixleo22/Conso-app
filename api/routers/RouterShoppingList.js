/* eslint-disable no-param-reassign */
const router = require('express').Router();

const Auth = require('../utils/Auth');

/**
 * @api {get} /shoppinglist get the list of shoppinglist of user
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
    const auth = req.headers.authorization;
    Auth(auth).then((user) => {
        res.status(200).json(user.shoppingList.list);
    }).catch((error) => {
        const err = JSON.parse(error.message);
        res.status(err.code).json(err);
    });
});

/**
 * @api {post} /shoppinglist add an item to the list of shoppingList
 * @apiName postShoppingList
 * @apiGroup shoppinglist
 *
 * @ApiHeader (Authorisation) {String} token Token Authorization value
 *
 * @apiError 400 invalid quantity
 * @apiError 500 Internal Server Error
 *
 * @apiSuccess (200) {List} List Return List
 */
router.post('/shoppinglist', (req, res) => {
    const auth = req.headers.authorization;
    const data = req.body;
    Auth(auth).then((user) => {
        if (!Number(data.quantity)) {
            res.status(400).json(({ type: 'error', code: 400, message: 'invalid quantity' }));
            return;
        }
        const indexOfCodebar = user.shoppingList.list.findIndex(
            (item) => item.codebar.toString() === data.codebar,
        );
        if (indexOfCodebar >= 0) {
            user.shoppingList.list[indexOfCodebar].quantity += 1;
        } else {
            user.shoppingList.list.push(data);
        }

        user.save((error, newUser) => {
            if (error) throw error;
            res.status(200).json(newUser.shoppingList.list);
        });
    }).catch((error) => {
        const err = JSON.parse(error.message);
        res.status(err.code).json(err);
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
// TODO change by patch
router.put('/shoppinglist', (req, res) => {
    const auth = req.headers.authorization;
    const data = req.body;
    Auth(auth).then((user) => {
        if (!Number(data.quantity)) {
            res.status(400).json(({ type: 'error', code: 400, message: 'invalid quantity' }));
            return;
        }
        user.shoppingList.list.find(
            (item) => item.codebar === data.codebar,
        ).quantity = data.quantity;
        user.save((error, newUser) => {
            if (error) throw error;
            res.status(200).json(newUser.shoppingList.list);
        });
    }).catch((error) => {
        const err = JSON.parse(error.message);
        res.status(err.code).json(err);
    });
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
router.delete('/shoppinglist', (req, res) => {
    const auth = req.headers.authorization;
    const data = req.body;
    Auth(auth).then((user) => {
        user.shoppingList.list = user.shoppingList.list.filter(
            (item) => item.codebar !== data.codebar,
        );
        user.save((error, newUser) => {
            if (error) throw error;
            res.status(200).json(newUser.shoppingList.list);
        });
    }).catch((error) => {
        const err = JSON.parse(error.message);
        res.status(err.code).json(err);
    });
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
// TODO replace by patch or put
router.post('/shoppinglist/settings', (req, res) => {
    const auth = req.headers.authorization;
    const data = req.body;
    Auth(auth).then((user) => {
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
    }).catch((error) => {
        const err = JSON.parse(error.message);
        res.status(err.code).json(err);
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
    const auth = req.headers.authorization;
    Auth(auth).then((user) => {
        res.status(200).json(user.shoppingList.settings);
    }).catch((error) => {
        const err = JSON.parse(error.message);
        res.status(err.code).json(err);
    });
});

module.exports = router;
