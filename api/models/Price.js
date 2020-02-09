const mongoose = require('mongoose');

const price = new mongoose.Schema({
    shop: String,
    product: String,
    updated_at: Date,
}, { versionKey: false });

module.exports = mongoose.model('price', price);
