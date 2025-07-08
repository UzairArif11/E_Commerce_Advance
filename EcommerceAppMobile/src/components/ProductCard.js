import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { addToCartAsync } from '../store/slices/cartSlice';
import { addToWishlistAsync, removeFromWishlistAsync, selectWishlistItems } from '../store/slices/wishlistSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { COLORS } from '../utils/constants';

const ProductCard = ({ product, onPress, viewMode = 'grid' }) => {
  const [imageError, setImageError] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const wishlist = useSelector(selectWishlistItems);
  
  const isInWishlist = wishlist.some(item => item._id === product._id);

  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to add items to cart');
      return;
    }
    try {
      await dispatch(addToCartAsync({ productId: product._id, quantity: 1 })).unwrap();
      Alert.alert('Success', 'Product added to cart!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add product to cart');
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to manage wishlist');
      return;
    }
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlistAsync(product._id)).unwrap();
        Alert.alert('Success', 'Product removed from wishlist!');
      } else {
        await dispatch(addToWishlistAsync(product._id)).unwrap();
        Alert.alert('Success', 'Product added to wishlist!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update wishlist');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text key={i} style={[styles.star, { color: i < fullStars ? '#fbbf24' : '#d1d5db' }]}>
          ★
        </Text>
      );
    }
    return stars;
  };

  // Grid view (default)
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(product)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {product.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{product.discount}%</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={handleWishlistToggle}
          activeOpacity={0.8}
        >
          <Icon
            name={isInWishlist ? 'heart' : 'heart-outline'}
            size={24}
            color={isInWishlist ? COLORS.error[500] : COLORS.white}
          />
        </TouchableOpacity>
        <Image
          source={{ 
            uri: imageError ? 'https://via.placeholder.com/200x200?text=No+Image' : product.image 
          }}
          style={styles.image}
          onError={() => setImageError(true)}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.category}>{product.category?.name || ''}</Text>
        <Text style={styles.title} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{product.description}</Text>
        
        <View style={styles.ratingContainer}>
          <View style={styles.stars}>
            {renderStars(product.rating)}
          </View>
          <Text style={styles.reviewCount}>({product.reviewCount || 0})</Text>
        </View>

        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${discountedPrice.toFixed(2)}</Text>
            {product.discount > 0 && (
              <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
            )}
          </View>
          
          <View style={styles.stockBadge}>
            <Text style={[styles.stockText, { 
              color: (product.countInStock || 10) > 0 ? COLORS.success[600] : COLORS.error[600] 
            }]}>
              {(product.countInStock || 10) > 0 ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.addToCartButton, { 
            backgroundColor: (product.countInStock || 10) > 0 ? COLORS.primary[600] : COLORS.gray[400] 
          }]}
          onPress={handleAddToCart}
          disabled={(product.countInStock || 10) === 0}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.error[500],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  discountText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  category: {
    fontSize: 12,
    color: COLORS.primary[600],
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.gray[600],
    marginBottom: 8,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  star: {
    fontSize: 14,
    marginRight: 2,
  },
  reviewCount: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: COLORS.gray[500],
    textDecorationLine: 'line-through',
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addToCartButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProductCard;
