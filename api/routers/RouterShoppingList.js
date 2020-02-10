const router = require('express').Router();

const Auth = require('../utils/Auth');

router.get('/shoppinglist', (req, res) => {
    const auth = req.headers.authorization;
    Auth(auth).then((user) => {
        res.status(200).json(user.shoppingList);
    }).catch((error) => {
        const err = JSON.parse(error.message);
        res.status(err.code).json(err);
    });
});

router.post('/shoppinglist', (req, res) => {
    const auth = req.headers.authorization;
    const data = req.body;
    Auth(auth).then((user) => {
        user.shoppingList.push(data);
        console.log(data);
        user.save((error, newUser) => {
            if (error) throw error;
            res.status(200).json(newUser.shoppingList);
        });
    }).catch((error) => {
        const err = JSON.parse(error.message);
        res.status(err.code).json(err);
    });
});

module.exports = router;
