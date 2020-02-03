const router = require('express').Router();

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
        });
        account.save((err2) => {
            if (err2) throw err2;
            res.status(201).json({ _id: account.id, email: account.email });
        });
    });
});

router.post('/connect', (req, res) => {
    const { email, password1 } = req.body;
    User.findOne({ email }, (err, user) => {
        if (!user) {
            res.status(400).json(({ type: 'error', code: 400, message: 'Email not exist' }));
        }
        if (!Password.hash(password1, user.password)) {
            res.status(400).json(({ type: 'error', code: 400, message: 'Password incorrect' }));
        }
        // TODO mettre les infos dans le localstorage
    });
});

module.exports = router;
