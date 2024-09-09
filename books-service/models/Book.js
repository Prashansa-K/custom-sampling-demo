const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    author: { type: String, required: true }
});

bookSchema.set('toJSON', {
    virtuals: true,  // Automatically include `id` field
    transform: (_, converted) => { delete converted._id; }  // Remove `_id` field from response
});

module.exports = mongoose.model('Book', bookSchema);
