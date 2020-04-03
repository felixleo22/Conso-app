const mongoose = require('mongoose');

const publicBasket = new mongoose.Schema({
    shoppingList: [{
        codebar: { type: Number, required: true },
        name: { type: String, required: true },
        brand: { type: String },
        icon: { type: String },
        quantity: { type: Number, required: true },
    }],
    expiredToken: { type: String, required: true },
    user: { type: String, required: true },
}, { versionKey: false });

module.exports = mongoose.model('publicBasket', publicBasket);
