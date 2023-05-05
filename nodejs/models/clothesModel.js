const mongoose = require('mongoose');

const clothesSchema = new mongoose.Schema({
    itemName: {
        required: true,
        type: String
    },
    genderName: {
        required: true,
        type: String
    },
    categoryName: {
        required: true,
        type: String
    },
    price: {
        required: true,
        type: Number
    },
    currency: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    imageUrl: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Clothes', clothesSchema);
