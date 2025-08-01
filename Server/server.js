const express = require('express');
const connectDB = require('./db/conn'); 
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser')

const userRoutes = require('./routes/userRoutes'); 
const shopRoutes = require('./routes/shopRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.json('Backend running');
})

app.use('/api/users', userRoutes);
app.use('/api/shops', shopRoutes);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})