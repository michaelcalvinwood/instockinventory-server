const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const fs = require("fs");
const { route } = require("./warehouses");
const { v4: uuidv4 } = require('uuid');

/*
 * writeFile writes the inventories array to disk in JSON format.
 */

saveInventories = inventories => fs.writeFileSync('./data/inventories.json', JSON.stringify(inventories));

/*
 * readFile reads the JSON formatted version of the inventories and parses it into the inventories array
 */

getInventories = () => JSON.parse(fs.readFileSync('./data/inventories.json', { encoding: 'utf8', flag: 'r' }));

/*
 * readFile reads the JSON formatted version of the warehouses and parses it into the video array
 */

getWarehouses = () => JSON.parse(fs.readFileSync('./data/warehouses.json', { encoding: 'utf8', flag: 'r' }));

/*
 * Sorts the inventories json by warehouse name 
 */

sortInventories = (inventories) => {

  inventories.sort((a, b) => {
    let warehouseNameA = a.warehouseName.toLowerCase();
    let warehouseNameB = b.warehouseName.toLowerCase();

    if (warehouseNameA < warehouseNameB) {
      return 1;
    }
    if (warehouseNameA > warehouseNameB) {
      return -1;
    }
    return 0;
  });

};

router.get('/', (req, res) => {
    const inventories = getInventories();
    if (inventories.length === 0) {
        res.status(400).send("No inventory");
        return;
    }
    res.status(200).json(inventories);
});

router.get('/:id', (req, res) => {
    const inventoryID = req.params.id;
    const inventories = getInventories();

    let selectedInventory = inventories.find(inventory => inventory.id === inventoryID);
    if (!selectedInventory) {
        return res.status(404).send("Inventory not found");
    } 
    res.status(200).json(selectedInventory);
});

router.put("/:id", (req, res) => {
  const inventoryID = req.params.id;
  const inventories = getInventories();

  let selectedInventory = inventories.find((inventory) => inventory.id === inventoryID);
  if (!selectedInventory) {
    return res.status(404).send("Inventory not found");
} 
//  Validation

  if (req.body.warehouseID === "") {
    return res.status(400).send("Warehouse Id field cannot be empty");
  }
  if (req.body.warehouseName === "") {
    return res.status(400).send("Warehouse name field cannot be empty");
  }
  if (req.body.itemName === "") {
    return res.status(400).send("Item name field cannot be empty");
  }
  if (req.body.description === "") {
    return res.status(400).send("Item description field cannot be empty");
  }
  if (req.body.category === "") {
    return res.status(400).send("Category field cannot be empty");
  }
  if (req.body.status === "") {
    return res.status(400).send("Status field cannot be empty");
  }
  if (req.body.quantity === "") {
    return res.status(400).send("Quantity field cannot be empty");
  }

  let editedInventory = {
    id: inventoryID,
    warehouseID: req.body.warehouseID,
    warehouseName: req.body.warehouseName,
    itemName: req.body.itemName,
    description: req.body.description,
    category: req.body.category,
    status: req.body.status,
    quantity: req.body.quantity,
  };

  let editedInventories = inventories.map((inventory) => {
    if (inventory.id === inventoryID) {
      return editedInventory;
    }
    return inventory;
  });
  
  sortInventories(editedInventories);
  saveInventories(editedInventories); 
  res.status(200).json(editedInventories);
});

router.delete('/:id', (req, res) => {
    const inventoryID = req.params.id;
    const inventories = getInventories();

    let selectedInventory = inventories.find(inventory => inventory.id === inventoryID);
    if (!selectedInventory) {
        return res.status(404).send("Inventory not found");
    } 

    const filteredInventory = inventories.filter(inventory => inventory.id !== inventoryID);
    saveInventories (filteredInventory); 
    res.status(200).send("inventory is deleted");
});

router.post("/", (req, res) => {
    const inventories = getInventories();
  
    // Validation

    if (req.body.warehouseID === "") {
      return res.status(400).send("Warehouse Id field cannot be empty");
    }
    if (req.body.warehouseName === "") {
      return res.status(400).send("Warehouse name field cannot be empty");
    }
    if (req.body.itemName === "") {
      return res.status(400).send("Item name field cannot be empty");
    }
    if (req.body.description === "") {
      return res.status(400).send("Item description field cannot be empty");
    }
    if (req.body.category === "") {
      return res.status(400).send("Category field cannot be empty");
    }
    if (req.body.status === "") {
      return res.status(400).send("Status field cannot be empty");
    }
    if (req.body.quantity === "") {
      return res.status(400).send("Quantity field cannot be empty");
    }
  
    inventories.push({
      id: uuidv4(),
      warehouseID: req.body.warehouseID,
      warehouseName: req.body.warehouseName,
      itemName: req.body.itemName,
      description: req.body.description,
      category: req.body.category,
      status: req.body.status,
      quantity: req.body.quantity,
    });

  sortInventories(inventories);
  saveInventories(inventories);
  res.status(200).json(inventories);
});

module.exports = router;