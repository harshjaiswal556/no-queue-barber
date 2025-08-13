const Booking = require("../schema/booking");

const createBooking = async (req, res) => {
  const {
    shop_id,
    customer_id,
    date,
    time_slot,
    status,
    services,
    amount,
    payment_status,
  } = req.body;
  try {
    if (
      !shop_id ||
      !customer_id ||
      !date ||
      !time_slot ||
      !status ||
      !services ||
      !amount ||
      !payment_status
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const booking = new Booking({
      shop_id,
      customer_id,
      date,
      time_slot,
      status,
      services,
      amount,
      payment_status,
    });

    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ messgae: error });
  }
};

const getBookingByCustomerId = async (req, res) => {
  const { customer_id } = req.params;
  const { shopName } = req.query;

  const filter = { customer_id };

  if (shopName) {
    filter.shopName = { $regex: shopName, $options: "i" };
  }

  try {
    const bookings = await Booking.find(filter);
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json({ bookings: bookings });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = { createBooking, getBookingByCustomerId };
