const mongoose = require('mongoose');

const user = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    shoppingList: [{
        codebar: { type: Number, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
    }],
}, { versionKey: false });

module.exports = mongoose.model('user', user);
