import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import { fetchProducts, searchProducts } from '../store/slices/productsSlice';
import { COLORS } from '../utils/constants';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { products, isLoading, error, searchResults } = useSelector(
    (state) => state.products
  );
  const { userInfo } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    { id: 'all', name: 'All', icon: 'grid-outline' },
    { id: 'electronics', name: 'Electronics', icon: 'phone-portrait-outline' },
    { id: 'clothing', name: 'Clothing', icon: 'shirt-outline' },
    { id: 'home', name: 'Home', icon: 'home-outline' },
    { id: 'books', name: 'Books', icon: 'book-outline' },
    { id: 'sports', name: 'Sports', icon: 'football-outline' },
  ];

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchProducts()).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh products');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      dispatch(searchProducts(query));
    }
  };

  const filteredProducts = () => {
    let productsToShow = searchQuery.trim() ? searchResults : products;
    
    if (selectedCategory !== 'all') {
      productsToShow = productsToShow.filter(
        (product) => product.category?.toLowerCase() === selectedCategory
      );
    }
    
    return productsToShow;
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id ? styles.categoryItemActive : styles.categoryItemInactive
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <View style={styles.categoryContent}>
        <Ionicons
          name={item.icon}
          size={16}
          color={selectedCategory === item.id ? 'white' : '#374151'}
        />
        <Text
          style={[
            styles.categoryText,
            selectedCategory === item.id ? styles.categoryTextActive : styles.categoryTextInactive
          ]}
        >
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <View style={styles.productItemContainer}>
      <ProductCard
        product={item}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>
              Hello, {userInfo?.name || 'Guest'}!
            </Text>
            <Text style={styles.subtitle}>
              What are you looking for today?
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={styles.profileButton}>
              <Ionicons name="person" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Products Grid */}
      <View style={styles.productsContainer}>
        {isLoading && products.length === 0 ? (
          <View style={styles.centerContent}>
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text style={styles.errorTitle}>
              Oops! Something went wrong
            </Text>
            <Text style={styles.errorText}>
              {error}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => dispatch(fetchProducts())}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : filteredProducts().length === 0 ? (
          <View style={styles.centerContent}>
            <Ionicons name="search-outline" size={48} color="#9CA3AF" />
            <Text style={styles.noResultsTitle}>
              No products found
            </Text>
            <Text style={styles.noResultsText}>
              {searchQuery
                ? `No results for "${searchQuery}"`
                : 'No products available in this category'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts()}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id || item.id}
            numColumns={2}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.productsList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  profileButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary[600],
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#1f2937',
    fontSize: 16,
  },
  categoriesContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryItem: {
    marginRight: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryItemActive: {
    backgroundColor: COLORS.primary[600],
    borderColor: COLORS.primary[600],
  },
  categoryItemInactive: {
    backgroundColor: 'white',
    borderColor: '#d1d5db',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    marginLeft: 4,
    fontSize: 14,
  },
  categoryTextActive: {
    color: 'white',
  },
  categoryTextInactive: {
    color: '#374151',
  },
  productsContainer: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
  },
  errorText: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  retryButton: {
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
  },
  noResultsText: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  productItemContainer: {
    width: '50%',
    padding: 8,
  },
  productsList: {
    paddingTop: 8,
  },
});

export default HomeScreen;
