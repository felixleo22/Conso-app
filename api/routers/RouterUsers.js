const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Password = require('../utils/Password');

function validateEmail(email) {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/igm;
    return re.test(email);
}


/**
 * @api {post} /user create a newAccount
 * @apiName createUser
 * @apiGroup user
 *
 * @apiParam (Body) {String} email email
 * @apiParam (Body) {String} password1 password1
 * @apiParam (Body) {String} password2 password2
 *
 * @apiError 400 Email invalid
 * @apiError 400 Password do not match
 * @apiError 400 Email already used
 *
 * @apiSuccess (201) {User} User User without password
 */
router.post('/user', (req, res) => {
    const { email, password1, password2 } = req.body;
    if (!validateEmail(email)) {
        res.status(400).json(({ type: 'error', code: 400, message: 'Email invalid' }));
        return;
    }
    if (password1 !== password2) {
        res.status(400).json(({ type: 'error', code: 400, message: 'Password do not match' }));
        return;
    }
    User.findOne({ email }, (err, user) => {
        if (user) {
            res.status(400).json(({ type: 'error', code: 400, message: 'Email already used' }));
            return;
        }
        const account = new User({
            email,
            password: Password.hash(password1),
            shoppingList: {
                list: [],
                settings: {
                    position: {
                        lat: 48.5,
                        lng: 0.5,
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

/**
 * @api {post} /login do the connexion
 * @apiName login
 * @apiGroup login
 *
 * @apiParam (Body) {String} email email
 * @apiParam (Body) {String} password1 password1
 * @apiParam (Body) {String} password2 password2
 *
 * @apiError 400 Email invalid
 * @apiError 400 Mising password
 *
 * @apiSuccess (200) {Token} Token Token with _id of user, email and token.
 */

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!validateEmail(email)) {
        res.status(400).json(({ type: 'error', code: 400, message: 'Email invalid' }));
        return;
    }
    if (!password) {
        res.status(400).json(({ type: 'error', code: 400, message: 'Mising password' }));
        return;
    }
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
