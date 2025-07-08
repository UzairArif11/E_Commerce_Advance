const User = require( "../models/User");
const bcrypt = require( "bcryptjs");
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

const updateUser = async (req, res) => {

  const { name, email, password } = req.body;

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 2. Update fields if present
    if (name) user.name = name;
    if (email) user.email = email;

    // 3. Hash password only if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // 4. Save and respond
    await user.save();
    res.json({ msg: "User updated successfully", user });

  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
const updateUserSettings = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    
    user.wantsEmailNotifications = req.body.wantsEmailNotifications ?? user.wantsEmailNotifications;
    user.wantsNotificationSound = req.body.wantsNotificationSound ?? user.wantsNotificationSound;
    user.wantsPushNotifications = req.body.wantsPushNotifications ?? user.wantsPushNotifications;

    await user.save();

    res.json({
      message: 'Settings updated',
      wantsEmailNotifications: user.wantsEmailNotifications,
      wantsNotificationSound: user.wantsNotificationSound,
      wantsPushNotifications: user.wantsPushNotifications,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-password')
    .populate('cart.product', 'name price images')
    .populate('wishlist', 'name price images');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user cart
// @route   GET /api/users/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('cart.product', 'name price images stock');

  if (user) {
    res.json(user.cart);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add item to cart
// @route   POST /api/users/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const user = await User.findById(req.user.id);
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (user) {
    const existingItem = user.cart.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    
    const populatedUser = await User.findById(req.user.id)
      .populate('cart.product', 'name price images stock');
    
    res.json(populatedUser.cart);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/users/cart/:productId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  const user = await User.findById(req.user.id);

  if (user) {
    const cartItem = user.cart.find(
      item => item.product.toString() === productId
    );

    if (cartItem) {
      if (quantity <= 0) {
        user.cart = user.cart.filter(
          item => item.product.toString() !== productId
        );
      } else {
        cartItem.quantity = quantity;
      }

      await user.save();
      
      const populatedUser = await User.findById(req.user.id)
        .populate('cart.product', 'name price images stock');
      
      res.json(populatedUser.cart);
    } else {
      res.status(404);
      throw new Error('Cart item not found');
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/users/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user.id);

  if (user) {
    user.cart = user.cart.filter(
      item => item.product.toString() !== productId
    );

    await user.save();
    
    const populatedUser = await User.findById(req.user.id)
      .populate('cart.product', 'name price images stock');
    
    res.json(populatedUser.cart);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Clear cart
// @route   DELETE /api/users/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.cart = [];
    await user.save();
    res.json({ message: 'Cart cleared' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('wishlist', 'name price images');

  if (user) {
    res.json(user.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add item to wishlist
// @route   POST /api/users/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const user = await User.findById(req.user.id);
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (user) {
    const existingItem = user.wishlist.find(
      item => item.toString() === productId
    );

    if (!existingItem) {
      user.wishlist.push(productId);
      await user.save();
    }
    
    const populatedUser = await User.findById(req.user.id)
      .populate('wishlist', 'name price images');
    
    res.json(populatedUser.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Remove item from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user.id);

  if (user) {
    user.wishlist = user.wishlist.filter(
      item => item.toString() !== productId
    );

    await user.save();
    
    const populatedUser = await User.findById(req.user.id)
      .populate('wishlist', 'name price images');
    
    res.json(populatedUser.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserSettings,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  updateUser
};

