const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Password = require('../utils/Password');

function validateEmail(email) {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/igm;
    return re.test(email);
}

router.post('/user', (req, res) => {
    const { email, password1, password2 } = req.body;

    User.findOne({ email }, (err, user) => {
        if (!validateEmail(email)) {
            res.status(400).json(({ type: 'error', code: 400, message: 'Email invalid' }));
            return;
        }
        if (user) {
            res.status(400).json(({ type: 'error', code: 400, message: 'Email already used' }));
            return;
        }
        if (password1 !== password2) {
            res.status(400).json(({ type: 'error', code: 400, message: 'Password do not match' }));
            return;
        }
        const account = new User({
            email,
            password: Password.hash(password1),
            shoppingList: {
                list: [],
                settings: {
                    center: {
                        position: {
                            lat: 0,
                            lng: 0,
                        },
                    },
                    radius: 0,
                },
            },
        });
        account.save((err2) => {
            if (err2) throw err2;
            res.status(201).json({ _id: account.id, email: account.email });
        });
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (!user) {
            res.status(400).json(({ auth: false }));
            return;
        }
        if (!Password.verify(password, user.password)) {
            res.status(400).json(({ auth: false }));
            return;
        }
        // TODO mettre le secret à l'abri
        const token = jwt.sign({ id: user._id, email: user.email }, 'test');
        res.status(200).json({ auth: true, token, user: { _id: user._id, email: user.email } });
    });
});

module.exports = router;
