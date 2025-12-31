const { default: mongoose, get } = require("mongoose");
const Shop = require("../schema/shop");
const { findUserById } = require("../services/user.service");
const Availability = require("../schema/availability");
const dayjs = require("dayjs");
const { findBookingByShopId } = require("../services/booking.service");

const createShopAvailability = async (req, res) => {
  const { barber_id, shop_id, day, totalChairs } = req.body;

  try {
    if (!barber_id && !shop_id && !day && !totalChairs) {
      return res.status(400).json({ message: "All inputs are required" });
    }

    const isBarberExists = await findUserById(barber_id);

    if (!isBarberExists) {
      return res.status(404).json({ message: "No user found" });
    }

    if (isBarberExists.user.role !== "barber") {
      return res
        .status(403)
        .json({ message: "Only barber can add shop details" });
    }

    const isShopExist = await Shop.findById({ _id: shop_id });

    if (!isShopExist) {
      return res.status(404).json({ message: "No shop found" });
    }

    const isShopAvailabilityAdded = await Availability.findOne({ shop_id });

    if (isShopAvailabilityAdded) {
      return res.status(409).json({ message: "Shop data already present" });
    }

    if (isShopExist.barber_id.toString() !== isBarberExists.user._id.toString()) {
      return res.status(403).json({
        message: "Only shop owner can upload their shop availabilty details",
      });
    }

    const formattedDay = {};
    for (const [name, time] of Object.entries(day)) {
      formattedDay[name] = {
        start: time.start,
        end: time.end,
      };
    }

    const newAvailability = new Availability({
      shop_id,
      day: formattedDay,
      totalChairs,
    });

    const saveAvailability = await newAvailability.save();
    res
      .status(201)
      .json({ message: "Availability added successfully", saveAvailability });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getShopAvailabilityByShopId = async (req, res) => {
  const id = req.params.id;
  const { date } = req.query;
  const token = req.headers.authorization.split(' ')[1];

  try {
    const availability = await Availability.findOne({
      shop_id: new mongoose.Types.ObjectId(id),
    });

    if (!availability) {
      return res.status(404).json({ message: "No availability found" });
    }

    if (!date) {
      return res.status(200).json({
        message: "Availability found successfully",
        availability,
        bookedSlots: [],
        totalChairs: availability.totalChairs,
      });
    }

    // Get all bookings for the specific shop and date
    const bookings = await findBookingByShopId({ shop_id: id }, date, token);

    // Group bookings by time slots and count chairs used
    const slotChairCount = {};

    bookings.bookings.forEach((booking) => {
      // For each minute in the booking duration, increment chair count
      const startTime = dayjs(`2023-01-01T${booking.time_slot.start}`);
      const endTime = dayjs(`2023-01-01T${booking.time_slot.end}`);
      let current = startTime;

      while (current.isBefore(endTime)) {
        const timeKey = current.format("HH:mm");
        slotChairCount[timeKey] = (slotChairCount[timeKey] || 0) + 1;
        current = current.add(1, "minute");
      }
    });

    // Create array of time slots that are fully booked (all chairs occupied)
    const fullyBookedSlots = [];
    for (const [timeSlot, chairsUsed] of Object.entries(slotChairCount)) {
      if (chairsUsed >= availability.totalChairs) {
        fullyBookedSlots.push(timeSlot);
      }
    }

    res.status(200).json({
      message: "Availability found successfully",
      availability,
      fullyBookedSlots,
      slotChairCount,
      totalChairs: availability.totalChairs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createShopAvailability, getShopAvailabilityByShopId }