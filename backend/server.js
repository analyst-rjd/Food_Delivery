const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const itemRoutes = require('./routes/items');
const restaurantRoutes = require('./routes/restaurants');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/items', itemRoutes);
app.use('/api/restaurants', restaurantRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
