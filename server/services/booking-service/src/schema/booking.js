const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    shop_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time_slot: {
        start: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['booked', 'cancelled', 'completed'],
        required: true
    },
    services:{
        type: [String],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    payment_status: {
        type: String,
        enum: ['completed', 'pending'],
        required: true
    }
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;