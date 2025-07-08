import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchWishlist, 
  removeFromWishlistAsync, 
  clearWishlistAsync,
  selectWishlistItems,
  selectWishlistLoading,
  selectWishlistError
} from '../store/slices/wishlistSlice';
import { addToCartAsync } from '../store/slices/cartSlice';
import { showToast } from '../utils/toast';

const WishlistScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const loading = useSelector(selectWishlistLoading);
  const error = useSelector(selectWishlistError);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

const handleRemoveFromWishlist = (productId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            dispatch(removeFromWishlistAsync(productId));
            showToast('Item removed from wishlist', 'success');
          }
        }
      ]
    );
  };

const handleAddToCart = async (product) => {
    try {
      await dispatch(addToCartAsync({ productId: product._id, quantity: 1 })).unwrap();
      showToast('Added to cart', 'success');
    } catch (error) {
      showToast('Failed to add to cart', 'error');
    }
  };

const handleClearWishlist = () => {
    Alert.alert(
      'Clear Wishlist',
      'Are you sure you want to clear your entire wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            dispatch(clearWishlistAsync());
            showToast('Wishlist cleared', 'success');
          }
        }
      ]
    );
  };

  const navigateToProductDetail = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderWishlistItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigateToProductDetail(item)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        
        {item.countInStock > 0 ? (
          <Text style={styles.inStock}>In Stock</Text>
        ) : (
          <Text style={styles.outOfStock}>Out of Stock</Text>
        )}
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              item.countInStock === 0 && styles.disabledButton
            ]}
            onPress={() => handleAddToCart(item)}
            disabled={item.countInStock === 0}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFromWishlist(item._id)}
          >
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyWishlist = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
      <Text style={styles.emptySubtitle}>
        Add items to your wishlist to see them here
      </Text>
      <TouchableOpacity
        style={styles.shopNowButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.shopNowText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        {wishlistItems.length > 0 && (
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={handleClearWishlist}
          >
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" />
      ) : wishlistItems.length === 0 ? (
        renderEmptyWishlist()
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => item._id}
          renderItem={renderWishlistItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#ff4444',
  },
  clearAllText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 8,
  },
  inStock: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginBottom: 12,
  },
  outOfStock: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  shopNowButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopNowText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default WishlistScreen;
