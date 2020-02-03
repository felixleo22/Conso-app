const mongoose = require('mongoose');

const user = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
}, { versionKey: false });

module.exports = mongoose.model('user', user);