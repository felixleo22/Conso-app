const mongoose = require('mongoose');

const publicBasket = new mongoose.Schema({
    shoppingList: {
        list: [{
            codebar: { type: Number, required: true },
            name: { type: String, required: true },
            brand: { type: String },
            icon: { type: String },
            quantity: { type: Number, required: true },
        }],
        settings: {
            position: {
                lat: { type: Number, required: false },
                lng: { type: Number, required: false },
            },
            radius: { type: Number, required: false },
        },
    },
    expiredToken: { type: String, required: true },
    user: { type: String, required: true },
}, { versionKey: false });

module.exports = mongoose.model('publicBasket', publicBasket);
