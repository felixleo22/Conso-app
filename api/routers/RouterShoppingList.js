/* eslint-disable no-param-reassign */
const router = require('express').Router();

const Auth = require('../utils/Auth');

router.get('/shoppinglist', (req, res) => {
    const auth = req.headers.authorization;
    Auth(auth).then((user) => {
        res.status(200).json(user.shoppingList.list);
    }).catch((error) => {
        const err = JSON.parse(error.message);
        res.status(err.code).json(err);
    });
});

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
