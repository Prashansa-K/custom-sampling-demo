const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true }
});

customerSchema.set('toJSON', {
    virtuals: true,  // Automatically include `id` field
    transform: (_, converted) => { delete converted._id; }  // Remove `_id` field from response
});

module.exports = mongoose.model('Customer', customerSchema);
