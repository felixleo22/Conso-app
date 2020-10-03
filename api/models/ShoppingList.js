const mongoose = require('mongoose');

const shoppingList = new mongoose.Schema({
  name: { type: String, required: true },
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
  user: { type: String, required: true },
}, { versionKey: false });

module.exports = mongoose.model('shoppingList', shoppingList);
