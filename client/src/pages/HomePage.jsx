// src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SortAsc, Grid, List, ChevronDown } from 'lucide-react';
import { Skeleton } from '@mui/material';

const HomePage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price', 'rating'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [showFilters, setShowFilters] = useState(false);

  // Initialize search term from URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axiosInstance.get('/products'),
          axiosInstance.get('/categories'),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? product.category?.name === selectedCategory : true;
      const matchesPrice = 
        (!priceRange.min || product.price >= parseFloat(priceRange.min)) &&
        (!priceRange.max || product.price <= parseFloat(priceRange.max));
      
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'price-low-high':
          return a.price - b.price;
        case 'price-high-low':
          return b.price - a.price;
        case 'name-a-z':
          return a.name.localeCompare(b.name);
        case 'name-z-a':
          return b.name.localeCompare(a.name);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortOrder('');
    setPriceRange({ min: '', max: '' });
  };

  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <Skeleton variant="rectangular" height={240} className="animate-pulse" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="100%" height={24} />
        <Skeleton variant="text" width="40%" height={20} />
        <div className="flex justify-between items-center">
          <Skeleton variant="text" width="30%" height={24} />
          <Skeleton variant="text" width="25%" height={20} />
        </div>
        <div className="flex space-x-2">
          <Skeleton variant="rectangular" height={36} className="flex-1 rounded-lg" />
          <Skeleton variant="rectangular" height={36} width={36} className="rounded-lg" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Hero Section Skeleton */}
        <div className="relative bg-gradient-primary text-white py-20">
          <div className="container-responsive">
            <div className="text-center space-y-4">
              <Skeleton variant="text" width="60%" height={48} className="mx-auto" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
              <Skeleton variant="text" width="40%" height={24} className="mx-auto" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
            </div>
          </div>
        </div>
        
        {/* Filters Skeleton */}
        <div className="container-responsive py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={48} className="rounded-lg" />
            ))}
          </div>
          
          {/* Products Grid Skeleton */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="absolute inset-0 opacity-30" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}} />
        
        <div className="container-responsive relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">
              Discover Amazing Products
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto text-white opacity-90">
              Shop the latest trends with unbeatable prices and quality
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button className="bg-purple-600 text-white px-8 py-4 text-lg rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
                Explore Collections
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg rounded-lg transition-all">
                View Deals
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-responsive py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          {/* Main Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for products, brands, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200"
            />
          </div>

          {/* Filter Toggle Button - Mobile */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden w-full flex items-center justify-center space-x-2 py-3 bg-gray-100 rounded-lg mb-4 transition-colors duration-200 hover:bg-gray-200"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="input text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="input text-sm"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="input"
                >
                  <option value="">Default</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="name-a-z">Name: A-Z</option>
                  <option value="name-z-a">Name: Z-A</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* View Mode & Clear */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
                <div className="flex space-x-2">
                  <div className="flex bg-gray-100 rounded-lg p-1 flex-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md transition-colors duration-200 ${
                        viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md transition-colors duration-200 ${
                        viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 text-sm rounded-lg transition-colors whitespace-nowrap"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600">
            <span className="font-semibold text-gray-800">{filteredProducts.length}</span> products found
            {searchTerm && (
              <span> for "<span className="font-semibold text-primary-600">{searchTerm}</span>"
              </span>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <SortAsc className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {sortOrder ? sortOrder.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Default order'}
            </span>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'space-y-4'
          }`}>
            {filteredProducts.map((product, index) => (
              <div key={product._id}>
                <ProductCard 
                  product={product} 
                  viewMode={viewMode}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Load More Button (if needed for pagination) */}
        {filteredProducts.length > 0 && filteredProducts.length >= 12 && (
          <div className="text-center mt-12">
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg rounded-lg transition-colors">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
