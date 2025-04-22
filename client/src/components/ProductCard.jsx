import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const isWishlisted = wishlistItems.some((item) => item.productId === product._id);

  const toggleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
      }));
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-all relative">
      {/* Heart Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:scale-110 transition"
      >
        {isWishlisted ? '❤️' : '🤍'}
      </button>

      <Link to={`/product/${product._id}`}>
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
          <p className="text-gray-600 mt-2">${product.price.toFixed(2)}</p>
          <div className="mt-4">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
              View Details
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
