const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Categories', categoriesSchema);
