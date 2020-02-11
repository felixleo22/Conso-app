const crypto = require('crypto');

module.exports = {
    hash(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

        return `${hash}$${salt}`;
    },
    verify(password, hash) {
        if (!password || !hash) return false;

        const splited = hash.split('$');
        if (splited.length !== 2) return false;

        const hashed = splited[0];
        const salt = splited[1];

        const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return hashed === verifyHash;
    },
};
