const Contact = require("../schema/contact");
const User = require("../schema/user");

const createHelp = async(req, res) => {
    try {
        const id = req.params.id;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const findUser = await User.find({ _id: id });
        if (!findUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newHelp = new Contact({
            user_id: id,
            message
        })

        const data = await newHelp.save();
        res.status(201).json({ message: 'Help request created successfully', data });

    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = { createHelp };