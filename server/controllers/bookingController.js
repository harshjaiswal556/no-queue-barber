const Booking = require("../schema/booking");
const Shop = require("../schema/shop");
const Availability = require("../schema/availability");
const dayjs = require("dayjs");

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

    const availability = await Availability.findOne({ shop_id });
    if (!availability) {
      return res.status(404).json({ message: "Shop availability not found" });
    }

    const existingBookings = await Booking.find({
      shop_id,
      date,
      status: { $in: ["booked", "confirmed"] },
    });

    const startTime = dayjs(`2023-01-01T${time_slot.start}`);
    const endTime = dayjs(`2023-01-01T${time_slot.end}`);
    
    let maxChairsUsed = 0;
    let current = startTime;
    
    while (current.isBefore(endTime)) {
      let chairsUsedAtTime = 0;
      
      existingBookings.forEach(booking => {
        const bookingStart = dayjs(`2023-01-01T${booking.time_slot.start}`);
        const bookingEnd = dayjs(`2023-01-01T${booking.time_slot.end}`);
        
        if (current.isSameOrAfter(bookingStart) && current.isBefore(bookingEnd)) {
          chairsUsedAtTime++;
        }
      });
      
      maxChairsUsed = Math.max(maxChairsUsed, chairsUsedAtTime);
      current = current.add(1, 'minute');
    }

    if (maxChairsUsed >= availability.totalChairs) {
      return res.status(409).json({ 
        message: "No chairs available for the selected time slot" 
      });
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
    res.status(500).json({ message: error.message });
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

    const today = Date.now();
    
    bookings.forEach(element => {
      if (dayjs(element.date).isBefore(dayjs(today), 'day') && element.status === 'booked') {
        updateBookingStatus(element._id, 'completed');
      }
    });

    res.status(200).json({ bookings: bookings, message: "Booking found successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (bookingId, status) => {
  try {
    await Booking.findByIdAndUpdate(bookingId, { status }, {
      new: true,
      runValidators: true
    });
  } catch (error) {
    console.error(`Failed to update booking status for ${bookingId}: ${error.message}`);
  }
}

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
