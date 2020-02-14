const mongoose = require('mongoose');

const user = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    settings: {
        center: {
            position: {
                lat: { type: Number, required: true },
                lng: { type: Number, required: true },
            },
        },
        radius: { type: Number, required: true },
    },
    shoppingList:
        [{
            codebar: { type: Number, required: true },
            name: { type: String, required: true },
            brand: { type: String },
            icon: { type: String },
            quantity: { type: Number, required: true },
        }],
}, { versionKey: false });

module.exports = mongoose.model('user', user);
