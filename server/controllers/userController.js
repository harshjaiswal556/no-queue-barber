const generateToken = require('../middleware/token');
const User = require('../schema/user');
const logger = require('../utils/winston');

const registerUser = async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    try {
        if (!name || !email || !password || !phone || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        if (role !== 'barber' && role !== 'customer') {
            return res.status(400).json({ message: 'Role must be either barber or customer' });
        }
        const newUser = new User({ name, email, password, phone, role });

        await newUser.save();
        res.status(201).json({
            message: 'User registered successfully', user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
                token: generateToken(newUser._id)
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            const token = generateToken(user._id);
            res.cookie("token", token, {
                httpOnly: false,
                secure: true,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000
            });
            res.cookie("role", user.role, {
                httpOnly: false,
                secure: true,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000
            });
            res.cookie("_id", user.id, {
                httpOnly: false,
                secure: true,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000
            });
            res.status(200).json({ message: 'Login successful', user, token: generateToken(user._id) });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const logoutUser = async (req, res) => {
    res.clearCookie("token");
    res.clearCookie("role");
    res.clearCookie("_id");
    res.status(200).json({ message: "User logged out" })
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser
};