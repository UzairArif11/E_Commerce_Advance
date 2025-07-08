import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  Share,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { addToCartAsync } from '../store/slices/cartSlice';
import { addToWishlistAsync, removeFromWishlistAsync, selectWishlistItems } from '../store/slices/wishlistSlice';
import CustomButton from '../components/CustomButton';
import { SCREEN_NAMES } from '../utils/constants';

const { width: screenWidth } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((state) => state.cart);
  const wishlistItems = useSelector(selectWishlistItems);
  const { user } = useSelector((state) => state.auth);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const scrollViewRef = useRef(null);

  const isInWishlist = wishlistItems.some((item) => item._id === product._id);
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || 'https://via.placeholder.com/400'];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Gray', 'Navy', 'Brown'];

  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please login to add items to cart',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate(SCREEN_NAMES.LOGIN) },
        ]
      );
      return;
    }

    try {
      await dispatch(addToCartAsync({ 
        productId: product._id, 
        quantity: quantity,
        selectedSize,
        selectedColor 
      })).unwrap();
      Alert.alert('Success', 'Product added to cart!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add product to cart. Please try again.');
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please login to manage wishlist',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate(SCREEN_NAMES.LOGIN) },
        ]
      );
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
      Alert.alert('Error', 'Failed to update wishlist. Please try again.');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this product: ${product.name}\nPrice: $${product.price}`,
        title: product.name,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const renderImageGallery = () => (
    <View style={styles.imageGalleryContainer}>
      <FlatList
        data={productImages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
          setSelectedImageIndex(index);
        }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width: screenWidth, height: 300 }}
            resizeMode="cover"
          />
        )}
      />
      
      {/* Image Indicators */}
      {productImages.length > 1 && (
        <View style={styles.indicatorContainer}>
          {productImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === selectedImageIndex ? styles.activeIndicator : styles.inactiveIndicator
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );

  const renderSizeSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>Size</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {sizes.map((size) => (
          <TouchableOpacity
            key={size}
            style={[
              styles.selectorOption,
              selectedSize === size ? styles.selectedOption : styles.unselectedOption
            ]}
            onPress={() => setSelectedSize(size)}
          >
            <Text
              style={[
                styles.selectorText,
                selectedSize === size ? styles.selectedText : styles.unselectedText
              ]}
            >
              {size}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderColorSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>Color</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.selectorOption,
              selectedColor === color ? styles.selectedOption : styles.unselectedOption
            ]}
            onPress={() => setSelectedColor(color)}
          >
            <Text
              style={[
                styles.selectorText,
                selectedColor === color ? styles.selectedText : styles.unselectedText
              ]}
            >
              {color}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderQuantitySelector = () => (
    <View style={styles.quantityContainer}>
      <Text style={styles.selectorTitle}>Quantity</Text>
      <View style={styles.quantityRow}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity(Math.max(1, quantity - 1))}
        >
          <Ionicons name="remove" size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>
          {quantity}
        </Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity(quantity + 1)}
        >
          <Ionicons name="add" size={20} color="#374151" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Detail</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerAction} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleWishlist}>
            <Ionicons
              name={isInWishlist ? "heart" : "heart-outline"}
              size={24}
              color={isInWishlist ? "#EF4444" : "#374151"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        {renderImageGallery()}

        <View style={styles.content}>
          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.productName}>
              {product.name}
            </Text>
            <Text style={styles.productPrice}>
              ${product.price}
            </Text>
            {product.originalPrice && product.originalPrice > product.price && (
              <View style={styles.priceRow}>
                <Text style={styles.originalPrice}>
                  ${product.originalPrice}
                </Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Text>
                </View>
              </View>
            )}
            
            {/* Rating */}
            <View style={styles.ratingRow}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name="star"
                    size={16}
                    color={star <= (product.rating || 0) ? "#FCD34D" : "#E5E7EB"}
                  />
                ))}
              </View>
              <Text style={styles.ratingText}>
                {product.rating || 0} ({product.reviewCount || 0} reviews)
              </Text>
            </View>

            {/* Stock Status */}
            <View style={styles.stockRow}>
              <View
                style={[
                  styles.stockIndicator,
                  product.stock > 0 ? styles.inStock : styles.outOfStock
                ]}
              />
              <Text
                style={[
                  styles.stockText,
                  product.stock > 0 ? styles.stockInText : styles.stockOutText
                ]}
              >
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </Text>
            </View>
          </View>

          {/* Size Selector */}
          {product.category === 'clothing' && renderSizeSelector()}

          {/* Color Selector */}
          {(product.category === 'clothing' || product.category === 'electronics') && renderColorSelector()}

          {/* Quantity Selector */}
          {renderQuantitySelector()}

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Description
            </Text>
            <Text style={styles.descriptionText}>
              {product.description || 'No description available for this product.'}
            </Text>
          </View>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Features
              </Text>
              {product.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Specifications */}
          {product.specifications && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Specifications
              </Text>
              <View style={styles.specificationsContainer}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <View key={key} style={styles.specificationRow}>
                    <Text style={styles.specificationKey}>{key.replace(/([A-Z])/g, ' $1')}</Text>
                    <Text style={styles.specificationValue}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <CustomButton
              title="Add to Cart"
              onPress={handleAddToCart}
              disabled={product.stock === 0}
              style={[
                styles.addToCartButton,
                product.stock === 0 ? styles.disabledButton : styles.activeButton
              ]}
            />
            <CustomButton
              title="Buy Now"
              onPress={async () => {
                await handleAddToCart();
                navigation.navigate(SCREEN_NAMES.CART);
              }}
              disabled={product.stock === 0}
              variant="outline"
              style={[
                styles.buyNowButton,
                product.stock === 0 ? styles.disabledOutlineButton : styles.activeOutlineButton
              ]}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerAction: {
    marginRight: 12,
  },
  content: {
    paddingHorizontal: 16,
  },
  imageGalleryContainer: {
    marginBottom: 16,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#2563EB',
  },
  inactiveIndicator: {
    backgroundColor: '#D1D5DB',
  },
  productInfo: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    color: '#6B7280',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  inStock: {
    backgroundColor: '#10B981',
  },
  outOfStock: {
    backgroundColor: '#EF4444',
  },
  stockText: {
    fontWeight: '500',
  },
  stockInText: {
    color: '#059669',
  },
  stockOutText: {
    color: '#DC2626',
  },
  selectorContainer: {
    marginBottom: 16,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  selectorOption: {
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  unselectedOption: {
    backgroundColor: 'white',
    borderColor: '#D1D5DB',
  },
  selectorText: {
    fontWeight: '500',
  },
  selectedText: {
    color: 'white',
  },
  unselectedText: {
    color: '#374151',
  },
  quantityContainer: {
    marginBottom: 24,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  descriptionText: {
    color: '#6B7280',
    lineHeight: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    color: '#6B7280',
    marginLeft: 8,
  },
  specificationsContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
  },
  specificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  specificationKey: {
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  specificationValue: {
    color: '#374151',
    fontWeight: '500',
  },
  actionsContainer: {
    marginBottom: 32,
  },
  addToCartButton: {
    marginBottom: 12,
  },
  buyNowButton: {
    // Additional styles if needed
  },
  activeButton: {
    backgroundColor: '#2563EB',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  activeOutlineButton: {
    borderColor: '#2563EB',
  },
  disabledOutlineButton: {
    borderColor: '#9CA3AF',
  },
});

export default ProductDetailScreen;
