const express = require("express");
const router = express.Router();
const {
  addItem,
  getItems,
  updateItem,
  deleteItem
} = require("../controllers/inventoryController");

router.post("/", addItem);
router.get("/", getItems);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
