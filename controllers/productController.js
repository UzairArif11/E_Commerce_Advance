// controllers/productController.js
const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name');
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).send('Server error');
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err.message);
    res.status(500).send('Server error');
  }
};

exports.addProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  try {
    let product = new Product({ name, description, price, category, stock });
    product = await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error adding product:', err.message);
    res.status(500).send('Server error');
  }
};

exports.updateProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product = await product.save();
    res.json(product);
  } catch (err) {
    console.error('Error updating product:', err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    await product.remove();
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).send('Server error');
  }
};
