import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Tooltip, Badge } from '@mui/material';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product, className = '', viewMode = 'grid' }) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isWishlisted = wishlistItems.some((item) => item.productId === product._id);
  
  // Mock rating for demo (in real app, this would come from product data)
  const rating = product.rating || 4.2;
  const reviewCount = product.reviewCount || Math.floor(Math.random() * 100) + 1;
  const discount = product.discount || 0;
  const originalPrice = discount > 0 ? product.price / (1 - discount / 100) : null;

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
      }));
      toast.success('Added to wishlist');
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    }));
    toast.success('Added to cart');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <StarIcon key="half" className="w-4 h-4 text-yellow-400 opacity-50" />
      );
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <StarBorderIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }
    
    return stars;
  };

  // Grid view layout
  if (viewMode === 'grid') {
    return (
      <div className={`group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 hover:-translate-y-2 ${className}`}>
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <Badge 
            badgeContent={`-${discount}%`} 
            className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
          />
        </div>
      )}

      {/* Wishlist Button */}
      <Tooltip title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'} arrow>
        <button
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${
            isWishlisted 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500 shadow-md'
          } hover:scale-110 group-hover:scale-105`}
        >
          {isWishlisted ? (
            <FavoriteIcon className="w-5 h-5" />
          ) : (
            <FavoriteBorderIcon className="w-5 h-5" />
          )}
        </button>
      </Tooltip>

      <Link to={`/product/${product._id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 shimmer-effect animate-pulse" />
          )}
          
          {!imageError ? (
            <img
              src={product.image || 'https://via.placeholder.com/400x400?text=No+Image'}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📷</span>
                </div>
                <p className="text-sm">No Image</p>
              </div>
            </div>
          )}
          
          {/* Quick Add to Cart Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={handleAddToCart}
              className="btn-primary btn-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center space-x-2"
            >
              <ShoppingCartIcon className="w-4 h-4" />
              <span>Quick Add</span>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Category */}
          {product.category && (
            <span className="text-xs text-primary-600 font-medium uppercase tracking-wider">
              {product.category.name || product.category}
            </span>
          )}
          
          {/* Product Name */}
          <h3 className="font-semibold text-gray-800 text-lg leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {product.name}
          </h3>
          
          {/* Description */}
          {product.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {product.description}
            </p>
          )}
          
          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {renderStars(rating)}
            </div>
            <span className="text-sm text-gray-500">({reviewCount})</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Stock Status */}
            <div className="flex items-center">
              {product.stock > 0 ? (
                <span className="text-xs text-success-600 bg-success-50 px-2 py-1 rounded-full font-medium">
                  In Stock
                </span>
              ) : (
                <span className="text-xs text-error-600 bg-error-50 px-2 py-1 rounded-full font-medium">
                  Out of Stock
                </span>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <button className="flex-1 btn-outline btn-sm text-xs">
              View Details
            </button>
            <Tooltip title="Add to Cart" arrow>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary btn-sm p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCartIcon className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
        </div>
      </Link>
    </div>
    );
  }

  // List view layout
  return (
    <div className={`group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 ${className}`}>
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <Badge 
            badgeContent={`-${discount}%`} 
            className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
          />
        </div>
      )}

      {/* Wishlist Button */}
      <Tooltip title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'} arrow>
        <button
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${
            isWishlisted 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500 shadow-md'
          } hover:scale-110 group-hover:scale-105`}
        >
          {isWishlisted ? (
            <FavoriteIcon className="w-5 h-5" />
          ) : (
            <FavoriteBorderIcon className="w-5 h-5" />
          )}
        </button>
      </Tooltip>

      <Link to={`/product/${product._id}`} className="flex h-full">
        {/* Product Image - List View */}
        <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden bg-gray-100">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 shimmer-effect animate-pulse" />
          )}
          
          {!imageError ? (
            <img
              src={product.image || 'https://via.placeholder.com/400x400?text=No+Image'}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl">📷</span>
                </div>
                <p className="text-xs">No Image</p>
              </div>
            </div>
          )}
          
          {/* Quick Add to Cart Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={handleAddToCart}
              className="btn-primary btn-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center space-x-2"
            >
              <ShoppingCartIcon className="w-4 h-4" />
              <span>Quick Add</span>
            </button>
          </div>
        </div>

        {/* Product Info - List View */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Category */}
            {product.category && (
              <span className="text-xs text-primary-600 font-medium uppercase tracking-wider">
                {product.category.name || product.category}
              </span>
            )}
            
            {/* Product Name */}
            <h3 className="font-bold text-gray-800 text-xl leading-tight group-hover:text-primary-600 transition-colors duration-200">
              {product.name}
            </h3>
            
            {/* Description */}
            {product.description && (
              <p className="text-gray-600 text-sm line-clamp-3">
                {product.description}
              </p>
            )}
            
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {renderStars(rating)}
              </div>
              <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
            </div>
          </div>
          
          <div className="space-y-4 mt-4">
            {/* Price & Stock */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center">
                {product.stock > 0 ? (
                  <span className="text-sm text-success-600 bg-success-50 px-3 py-1 rounded-full font-medium">
                    In Stock ({product.stock} left)
                  </span>
                ) : (
                  <span className="text-sm text-error-600 bg-error-50 px-3 py-1 rounded-full font-medium">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button className="flex-1 btn-outline text-sm py-2">
                View Details
              </button>
              <Tooltip title="Add to Cart" arrow>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <ShoppingCartIcon className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
