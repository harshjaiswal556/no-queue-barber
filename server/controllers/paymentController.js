const Razorpay = require("razorpay");
const Payment = require("../schema/payment");
const dotenv = require('dotenv');
const crypto = require("crypto");
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { booking_id, amount, currency } = req.body;
    const receipt_no = `receipt_${Date.now()}`;
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: receipt_no,
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    const payment = new Payment({
      user_id,
      booking_id,
      amount,
      currency,
      receipt_no,
      razorpay_order_id: order.id,
    });
    await payment.save();
    res.status(201).json({
      message: "Order created successfully",
      razorpayOrder: order,
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

  if (generatedSignature === razorpay_signature) {
    // Mark payment as successful
    
    await Payment.findOneAndUpdate(
        { razorpay_order_id },
        {
          payment_id: razorpay_payment_id,
          status: "paid",
        }
      );

    res.status(200).json({ message: "Payment verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid signature, verification failed" });
  }
};

module.exports = { createOrder, verifyPayment };
