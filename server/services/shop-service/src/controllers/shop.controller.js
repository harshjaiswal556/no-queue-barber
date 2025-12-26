const { default: mongoose, get } = require("mongoose");
const Shop = require("../schema/shop");
const { findUserById } = require("../services/user.service");

const convertTo24HourFormat = (time) => {
  const [hour, minute] = time.split(":");
  const period = time.slice(-2);
  let hour24 = parseInt(hour, 10);

  if (period === "AM" && hour24 === 12) {
    hour24 = 0;
  } else if (period === "PM" && hour24 !== 12) {
    hour24 += 12;
  }

  return `${hour24.toString().padStart(2, "0")}:${minute}`;
};

const createShop = async (req, res) => {
  const {
    barber_id,
    shopName,
    address,
    zipcode,
    services,
    start,
    end,
    imageUrl,
  } = req.body;

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
    const isBarberExists = await findUserById(barber_id);

    if (!isBarberExists) {
      return res.status(404).json({ message: "No user found" });
    }

    if (isBarberExists.role !== "barber") {
      return res
        .status(403)
        .json({ message: "Only barber can add shop details" });
    }

    const start24 = convertTo24HourFormat(start);
    const end24 = convertTo24HourFormat(end);

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
        start: start24,
        end: end24,
      },
      imageUrl,
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
    const shops = await Shop.find({
      barber_id: new mongoose.Types.ObjectId(id),
    });
    if (!shops) {
      return res.status(404).json({ message: "No shop found" });
    }
    res.status(200).json({ message: "Shop found successfully", shops });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllShops = async (req, res) => {
  try {
    const { zipcode, shopName, services, page = 1, limit = 8 } = req.query;

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
        : services.split(",").map((s) => s.trim());

      servicesArray.forEach((service) => {
        filter[`services.${service}`] = { $exists: true };
      });
    }

    const perPage = Math.min(parseInt(limit) || 10, 20);
    const currentPage = parseInt(page) || 1;

    const shops = await Shop.find(filter)
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    const totalShops = await Shop.countDocuments(filter);

    if (!shops || shops.length === 0) {
      return res.status(404).json({ message: "No shop found" });
    }

    res.status(200).json({
      message: "Shop found successfully",
      shops,
      pagination: {
        total: totalShops,
        page: currentPage,
        perPage,
        totalPages: Math.ceil(totalShops / perPage),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getShopById = async (req, res) => {
  const id = req.params.id;
  try {
    const shop = await Shop.find({ _id: new mongoose.Types.ObjectId(id) });
    if (!shop) {
      return res.status(404).json({ message: "No shop found" });
    }
    res.status(200).json({ message: "Shop found successfully", shop });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createShop,
  getShopByBarberId,
  getAllShops,
  getShopById,
};
