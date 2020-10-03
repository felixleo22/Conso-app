const mongoose = require('mongoose');

const user = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
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
}, { versionKey: false });

module.exports = mongoose.model('user', user);
