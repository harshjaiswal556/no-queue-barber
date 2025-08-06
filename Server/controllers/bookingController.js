
const createBooking = async (req, res) => {
    const { shop_id, customer_id, date, time_slot, status, amount, payment_stats } = req.body;
    try {

    } catch (error) {
        res.status(500).json({ messgae: error.messgae })
    }
}

module.exports = { createBooking }