// src/pages/WishlistPage.jsx
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { wishlistItems } = useSelector((state) => state.wishlist);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No products in your wishlist.</p>
          <Link
            to="/"
            className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {wishlistItems.map((item) => (
            <div
              key={item.productId}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-all"
            >
              <img
                src={item.image || 'https://via.placeholder.com/300'}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                <p className="text-gray-600 mt-2">${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
