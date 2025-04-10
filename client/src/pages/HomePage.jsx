// src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');

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
    .filter((product) => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory ? product.category?.name === selectedCategory : true)
    )
    .sort((a, b) => {
      if (sortOrder === 'price-low-high') {
        return a.price - b.price;
      } else if (sortOrder === 'price-high-low') {
        return b.price - a.price;
      } else if (sortOrder === 'name-a-z') {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === 'name-z-a') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

  if (loading) {
    return <div className="text-center py-20 text-xl font-semibold">Loading Products...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search, Filter, Sort Controls */}
      <div className="flex flex-col md:flex-row md:justify-between mb-8 space-y-4 md:space-y-0 md:space-x-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-3 rounded-lg flex-1"
        />

        {/* Filter by Category */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-3 rounded-lg flex-1"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-3 rounded-lg flex-1"
        >
          <option value="">Sort</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="name-a-z">Name: A-Z</option>
          <option value="name-z-a">Name: Z-A</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
