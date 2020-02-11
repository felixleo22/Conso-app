const mongoose = require('mongoose');

const price = new mongoose.Schema({
    shop: String,
    product: String,
    price: Number,
    updated_at: Date,
}, { versionKey: false });

module.exports = mongoose.model('price', price);
