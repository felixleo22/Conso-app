const mongoose = require('mongoose');

const shop = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    position: { type: String, required: true },
}, { versionKey: false });

module.exports = mongoose.model('shop', shop);
