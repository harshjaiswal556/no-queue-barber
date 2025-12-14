const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./src/db/conn');
const helpRoutes = require('./src/routes/help.route');
const httpLogger = require('../../middleware/logger');

dotenv.config({ path: "./.env" });
dotenv.config({ path: "./services/user-service/.env" })

const app = express();
const port = process.env.SUPPORT_PORT;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(cookieParser());
app.use(express.json());
app.use(httpLogger);

connectDB();

app.get('/', (req, res) => {
    res.json('User Service running');
});

app.use('/api/v1/support', helpRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})