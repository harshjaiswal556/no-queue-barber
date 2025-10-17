const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Booking",
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    currency:{
        type: String,
        required: true
    },
    receipt_no: {
        type: String,
        required: true,
        unique: true
    },
    razorpay_order_id: { type: String },
}, {
    timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;