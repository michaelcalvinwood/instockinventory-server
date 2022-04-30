require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.static('public'))
app.use(express.json())
app.use(cors());

// Routes
const warehousesRoute = require('./routes/warehouses');
app.use('/warehouses', warehousesRoute);
const inventoryRoute = require('./routes/inventory');
app.use('/inventory', inventoryRoute);

// Listen
app.listen(PORT, () => console.log(`server is running on port ${PORT}`))
