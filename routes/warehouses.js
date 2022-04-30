const express = require("express");
const router = express.Router();
const fs = require("fs");
const validator = require('validator');
const { phone } = require('phone');
const { v4: uuidv4 } = require('uuid');

/*
 * writeFile writes the warehouses array to disk in JSON format.
 */

saveWarehouses = warehouses => fs.writeFileSync('./data/warehouses.json', JSON.stringify(warehouses));

/*
 * readFile reads the JSON formatted version of the warehouses and parses it into the warehouses array
 */

getWarehouses = () => JSON.parse(fs.readFileSync('./data/warehouses.json', { encoding: 'utf8', flag: 'r' }));

/*
 * readFile reads the JSON formatted version of the inventories and parses it into the video array
 */

getInventories = () => JSON.parse(fs.readFileSync('./data/inventories.json', { encoding: 'utf8', flag: 'r' }));

saveInventories = inventories => fs.writeFileSync('./data/inventories.json', JSON.stringify(inventories));


router.get('/:id', (req, res) => {
  const warehouseID = req.params.id;
  const warehouses = getWarehouses();
  const inventories = getInventories();

  let selectedWarehouse = warehouses.find(warehouse => warehouse.id === warehouseID);
  if (!selectedWarehouse) {
    return res.status(404).send("Warehouse not found");
  }

  selectedWarehouse.inventory = [];
  inventories.forEach(inventory => {
    if (inventory.warehouseID === warehouseID) {
      selectedWarehouse.inventory.push(inventory);
    }
  });
  res.status(200).json(selectedWarehouse);
});

router.post("/", (req, res) => {
  const warehouses = getWarehouses();

  // Validation

  if (req.body.name === "") {
    return res.status(400).send("Warehouse name field cannot be empty");
  }
  if (req.body.address === "") {
    return res.status(400).send("Warehouse address field cannot be empty");
  }
  if (req.body.city === "") {
    return res.status(400).send("Warehouse city field cannot be empty");
  }
  if (req.body.country === "") {
    return res.status(400).send("Warehouse country field cannot be empty");
  }
  if (req.body.contactName === "") {
    return res.status(400).send("Contact name field cannot be empty");
  }
  if (req.body.contactPosition === "") {
    return res.status(400).send("Contact position field cannot be empty");
  }
  if (req.body.contactPhone === "") {
    return res.status(400).send("Contact phone number field cannot be empty");
  }
  if (!phone(req.body.contactPhone).isValid) {
    return res.status(400).send("Please enter a valid phone number");
  }
  if (req.body.contactEmail === "") {
    return res.status(400).send("Contact email field cannot be empty");
  }
  if (!validator.isEmail(req.body.contactEmail)) {
    return res.status(400).send("Please enter a valid email");
  }

  warehouses.push({
    id: uuidv4(),
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    contact: {
      name: req.body.contactName,
      position: req.body.contactPosition,
      phone: req.body.contactPhone,
      email: req.body.contactEmail,
    },
  })

  // sort data by warehouse name

  warehouses.sort((a,b) => {
    let warehouseNameA = a.name.toLowerCase()
    let warehouseNameB = b.name.toLowerCase();

    if (warehouseNameA < warehouseNameB) {
      return -1;
    }
    if (warehouseNameA > warehouseNameB) {
      return 1;
    }
    return 0;
  })

  saveWarehouses(warehouses);
  res.status(200).send(`Created ${req.body.name} warehouse`);
})


router.put("/:id", (req, res) => {
  const warehouseID = req.params.id;
  const warehouses = getWarehouses();

  let selectedWarehouse = warehouses.find((warehouse) => warehouse.id === warehouseID);
  if (!selectedWarehouse) {
    return res.status(404).send("Warehouse not found");
  }

  // Validation

  if (req.body.name === "") {
    return res.status(400).send("Warehouse name field cannot be empty");
  }
  if (req.body.address === "") {
    return res.status(400).send("Warehouse address field cannot be empty");
  }
  if (req.body.city === "") {
    return res.status(400).send("Warehouse city field cannot be empty");
  }
  if (req.body.country === "") {
    return res.status(400).send("Warehouse country field cannot be empty");
  }
  if (req.body.contactName === "") {
    return res.status(400).send("Contact name field cannot be empty");
  }
  if (req.body.contactPosition === "") {
    return res.status(400).send("Contact position field cannot be empty");
  }
  if (req.body.contactPhone === "") {
    return res.status(400).send("Contact phone number field cannot be empty");
  }
  if (!phone(req.body.contactPhone).isValid) {
    return res.status(400).send("Please enter a valid phone number");
  }
  if (req.body.contactEmail === "") {
    return res.status(400).send("Contact email field cannot be empty");
  }
  if (!validator.isEmail(req.body.contactEmail)) {
    return res.status(400).send("Please enter a valid email");
  }

  let editedWarehouse = {
    id: warehouseID,
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    contact: {
      name: req.body.contactName,
      position: req.body.contactPosition,
      phone: req.body.contactPhone,
      email: req.body.contactEmail,
    },
  };

  let editedWarehouses = warehouses.map((warehouse) => {
    if (warehouse.id === warehouseID) {
      return editedWarehouse;
    }
    return warehouse;
  });

  saveWarehouses(editedWarehouses);
  res.status(200).send(editedWarehouse);
});

router.delete('/:id', (req, res) => {
  const warehouseID = req.params.id;
  const warehouses = getWarehouses();
  const inventories = getInventories();

  const filteredWarehouses = warehouses.filter(warehouse => warehouse.id !== warehouseID);
  const filteredInventories = inventories.filter(inventory => inventory.warehouseID !== warehouseID);

  saveWarehouses(filteredWarehouses);
  saveInventories(filteredInventories);
  res.status(200).send('warehouse deleted if existed');
});

router.get('/', (_req, res) => {
  const warehouses = getWarehouses();
  res.status(200).json(warehouses);
})

module.exports = router;