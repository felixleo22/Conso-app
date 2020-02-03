const router = require('express').Router();
const crypto = require('crypto');


const User = require('../models/User');

router.post('/signin', (req, res) => {
    const { email, password1, password2 } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err) throw err;

        if (user) {
            return res.status(400).json(({ type: 'error', code: 400, message: 'Email already used' }));
        }

        if (password1 !== password2) {
            return res.status(400).json(({ type: 'error', code: 400, message: 'Password do not match' }));
        }

        const account = new User({
            email,
            password: crypto.createHmac('sha512', password1).update('10a3dfcce237614807a9593a7ab95976').digest('hex'),
        });

        account.save((err2) => {
            if (err2) throw err;
            return res.status(201).json({ _id: account.id, email: account.email });
        });
    });
});


module.exports = router;
