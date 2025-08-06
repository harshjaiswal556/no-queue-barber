const { default: mongoose } = require("mongoose");
const Availability = require("../schema/availability");
const Shop = require("../schema/shop");
const User = require("../schema/user");

const createShop = async (req, res) => {
  const { barber_id, shopName, address, zipcode, services, start, end, imageUrl } =
    req.body;

  try {
    if (
      !barber_id &&
      !shopName &&
      !address &&
      !zipcode &&
      !services &&
      !start &&
      !end
    ) {
      return res.status(400).json({ message: "All inputs are required" });
    }
    const isBarberExists = await User.findById({ _id: barber_id });

    if (!isBarberExists) {
      return res.status(404).json({ message: "No user found" });
    }

    if (isBarberExists.role !== "barber") {
      return res
        .status(403)
        .json({ message: "Only barber can add shop details" });
    }

    const formattedService = {};
    for (const [name, details] of Object.entries(services)) {
      formattedService[name] = {
        price: details.price,
        time: details.time,
      };
    }

    const newShop = new Shop({
      barber_id,
      shopName,
      address,
      zipcode,
      services: formattedService,
      workingHours: {
        start,
        end,
      },
      imageUrl
    });

    const saveShop = await newShop.save();
    res.status(201).json({ message: "Shop added successfully", saveShop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getShopByBarberId = async (req, res) => {
  const id = req.params;
  try {
    const shops = await Shop.find({ barber_id: new mongoose.Types.ObjectId(id) });
    if (!shops) {
      return res.status(404).json({ message: "No shop found" });
    }
    res.status(200).json({ message: "Shop found successfully", shops });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message })
  }
}

const createShopAvailability = async (req, res) => {
  const { barber_id, shop_id, day, totalChairs } = req.body;

  try {
    if (!barber_id && !shop_id && !day && !totalChairs) {
      return res.status(400).json({ message: "All inputs are required" });
    }

    const isBarberExists = await User.findById({ _id: barber_id });

    if (!isBarberExists) {
      return res.status(404).json({ message: "No user found" });
    }

    if (isBarberExists.role !== "barber") {
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
      return res.status(409).json({ message: "Shop data already present" })
    }

    if (isShopExist.barber_id.toString() !== isBarberExists._id.toString()) {
      return res.status(403).json({ message: "Only shop owner can upload their shop availabilty details" });
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
    res.status(201).json({ message: "Availability added successfully", saveAvailability });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllShops = async (req, res) => {
  try {
    const { zipcode, shopName, services } = req.query;

    const filter = {};

    if (zipcode) {
      filter.zipcode = zipcode;
    }

    if (shopName) {
      filter.shopName = { $regex: shopName, $options: "i" };
    }

    if (services) {
      const servicesArray = Array.isArray(services)
        ? services
        : services.split(',').map(s => s.trim());

      servicesArray.forEach(service => {
        filter[`services.${service}`] = { $exists: true };
      });
    }

    const shops = await Shop.find(filter);
    if (!shops) {
      return res.status(404).json({ message: "No shop found" });
    }
    res.status(200).json({ message: "Shop found successfully", shops });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createShop, createShopAvailability, getShopByBarberId, getAllShops };
