const Booking = require("../schema/booking");
const Shop = require("../schema/shop");

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

  try {
    let shopIds = [];

    if (shopName) {
      const matchedShops = await Shop.find({
        shopName: { $regex: shopName, $options: "i" }
      }).select("_id");

      if (matchedShops.length === 0) {
        return res.status(404).json({ message: "No shops found with that name" });
      }

      shopIds = matchedShops.map(shop => shop._id);
    }

    const filter = { customer_id };

    if (shopIds.length > 0) {
      filter.shop_id = { $in: shopIds };
    }

    const bookings = await Booking.find(filter);
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json({ bookings: bookings, message: "Booking found successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelBookingByBookingId = async (req, res) => {
  const { booking_id } = req.params;
  const status = 'cancelled';
  try {
    const cancelBooking = await Booking.findByIdAndUpdate({ _id: booking_id }, { status }, {
      new: true,
      runValidators: true
    })

    if (!cancelBooking) {
      res.status(404).json({ message: "No booking found" })
    }
    res.status(200).json({ bookings: cancelBooking, message: "Booking cancelled successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createBooking, getBookingByCustomerId, cancelBookingByBookingId };
