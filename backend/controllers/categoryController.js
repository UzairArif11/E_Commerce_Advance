// controllers/categoryController.js
const Category = require("../models/Category");
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
exports.addCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("Error adding category:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
exports.updateCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }
    category.name = name || category.name;
    category.description = description || category.description;
    await category.save();
    res.json(category);
  } catch (error) {
    console.error("Error updating category:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }
    // await category.remove();
    await category.deleteOne({ _id: req.params.id });
    res.json({ msg: "Category removed" });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};