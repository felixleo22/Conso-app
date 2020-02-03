const router = require('express').Router();

const User = require('../models/User');
const Password = require('../utils/Password');


router.post('/user', (req, res) => {
    const { email, password1, password2 } = req.body;

    User.findOne({ email }, (err, user) => {
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


module.exports = router;
