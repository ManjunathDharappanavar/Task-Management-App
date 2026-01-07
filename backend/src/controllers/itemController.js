const Item = require("../models/Item");

exports.addItem = async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.status(201).json(item);
};

exports.getItems = async (req, res) => {
  const items = await Item.find();
  res.json(items);
};

exports.updateItem = async (req, res) => {
  const updated = await Item.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

exports.deleteItem = async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Item deleted" });
};
