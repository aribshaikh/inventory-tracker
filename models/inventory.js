const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
    product: { type: String, required: true},
    amount: { type: Number, required: true},
    color: { type: String, required: true},
    vendor: { type: String, required: true},
}, { toJSON: { virtuals: true } });

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;