const mongoose = require('mongoose');

const shopModel = mongoose.Schema({
    barber_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    shopName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    zipcode: {
        type: Number,
        required: true
    },
    services: {
        type: Map,
        of: new mongoose.Schema({
            price: { type: Number, required: true },
            time: { type: Number, required: true }
        }),
        default: {}
    },
    workingHours: {
        start: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        }
    },
    imageUrl: {
        type: String,
        required: false
    }
}, {
    timestamps: true
})

const Shop = mongoose.model('Shop', shopModel);
module.exports = Shop