const Inventory = require("../models/Inventory");

// ADD
exports.addItem = async (req, res) => {
  try {
    const { name, category, quantity, price } = req.body;

    if (!name || !category || quantity == null || price == null) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const item = new Inventory({ name, category, quantity, price });
    const savedItem = await item.save();

    res.status(201).json({
      success: true,
      message: "Item added successfully",
      item: savedItem
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// VIEW
exports.getItems = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.updateItem = async (req, res) => {
  try {
    const updated = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Item not found" });

    res.json({
      success: true,
      message: "Item updated successfully",
      item: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deleteItem = async (req, res) => {
  try {
    const deleted = await Inventory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Item not found" });

    res.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
