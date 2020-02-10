const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (token) => new Promise((resolve, reject) => {
    if (!token) {
        reject(new Error(JSON.stringify({ type: 'error', code: 401, message: 'Authentification required' })));
        return;
    }
    jwt.verify(token, 'test', (err, decoded) => {
        if (!decoded) {
            reject(new Error(JSON.stringify({ type: 'error', code: 403, message: 'Forbidden' })));
            return;
        }
        User.findById(decoded.id, (err2, user) => {
            if (!user) {
                reject(new Error(JSON.stringify({ type: 'error', code: 403, message: 'Forbidden 2' })));
                return;
            }
            resolve(user);
        });
    });
});
