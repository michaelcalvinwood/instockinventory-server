const DOMAIN = 'instockinventory.com';
const PORT = process.env.PORT || 8080;

require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const https = require('https');
const fs = require('fs');

// Middleware
app.use((req, res, next) => {
    console.log(req.url);
    next();
});

app.use(express.static('public'))
app.use(express.json())
app.use(cors());

// Routes
const warehousesRoute = require('./routes/warehouses');
app.use('/warehouses', warehousesRoute);
const inventoryRoute = require('./routes/inventory');
app.use('/inventory', inventoryRoute);

// Listen
const httpsServer = https.createServer({
    key: fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/privkey.pem`),
    cert: fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/fullchain.pem`),
   }, app);
   
httpsServer.listen(PORT, () => {   
    console.log(`HTTPS Server running on port ${PORT}`);
});