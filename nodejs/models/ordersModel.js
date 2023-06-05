const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    orderItems: {
        required: true,
        type: Array
    },
    user: {
        required: true,
        type: Object
    },
    date: {
        required: true,
        type: Date
    },
    total: {
        required: true,
        type: Number
    },
    status: {
        required: true,
        type: String
    },
    deliveryOptions: {
        required: true,
        type: Object
    }
})

module.exports = mongoose.model('Orders', ordersSchema);
