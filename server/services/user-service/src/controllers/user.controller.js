const User = require("../schema/user")

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById({ _id: id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error', error });
    }
}

module.exports = { getUserById }