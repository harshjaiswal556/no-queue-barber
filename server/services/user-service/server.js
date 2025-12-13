const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./src/db/conn');
const authRoutes = require('./src/routes/auth.route');

dotenv.config({ path: "./.env" });
dotenv.config({path: "./services/user-service/.env"})

const app = express();
const port = process.env.USER_PORT;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(cookieParser());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.json('User Service running');
});

app.use('/api/v1/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})