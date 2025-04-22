// src/pages/ProductPage.jsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-hot-toast';
import { Rating, TextField, Button } from "@mui/material";
import { useSelector } from 'react-redux';
const ProductPage = () => {
  const { id } = useParams(); // product id from URL
  const dispatch = useDispatch();

  const [reviewText, setReviewText] = useState("");
  const [ratingValue, setRatingValue] = useState(0);
  const [reviews, setReviews] = useState( []); // Fetch existing reviews if you load them with product
  const { userInfo } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
      })
    );

    toast.success("Added to cart!");
  };

  // Dummy function to submit review
  const submitReview = async () => {
    if (!userInfo) {
      alert("Please login to submit a review.");
      return;
    }
    if (!ratingValue || !reviewText) {
      alert("Please fill in both rating and review.");
      return;
    }
    try {
      const newReview = {
        user: userInfo.userId,
        name: userInfo.email,
        rating: ratingValue,
        comment: reviewText,
        createdAt: new Date().toISOString(),
      };
      setReviews([...reviews, newReview]);
      setReviewText("");
      setRatingValue(0);
      alert("Review submitted!");
    } catch (error) {
      console.error("Error submitting review:", error.message);
      alert("Failed to submit review.");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading Product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-xl font-semibold text-red-500">
        Product not found!
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Product Image */}
        <div className="flex-1">
          <img
            src={product.image || "https://via.placeholder.com/500"}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-600 my-4">{product.description}</p>
          <p className="text-2xl font-semibold text-blue-600">
            ${product.price.toFixed(2)}
          </p>
          <button
            onClick={handleAddToCart}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
      {/* Reviews Section */}
<div className="mt-10">
  <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>

  {/* Existing Reviews */}
  <div className="space-y-6 mb-10">
    {reviews.length > 0 ? (
      reviews.map((review, index) => (
        <div key={index} className="border-b pb-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">{review.name}</span>
            <Rating value={review.rating} readOnly />
          </div>
          <p className="text-gray-600 mt-2">{review.comment}</p>
          <div className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</div>
        </div>
      ))
    ) : (
      <p className="text-gray-500">No reviews yet.</p>
    )}
  </div>

  {/* Submit New Review */}
  <div className="bg-gray-50 p-6 rounded-lg shadow space-y-4">
    <h3 className="text-xl font-semibold text-gray-700">Write a Review</h3>

    <Rating
      name="rating"
      value={ratingValue}
      onChange={(event, newValue) => setRatingValue(newValue)}
    />

    <TextField
      label="Your Review"
      multiline
      rows={4}
      fullWidth
      value={reviewText}
      onChange={(e) => setReviewText(e.target.value)}
    />

    <Button
      variant="contained"
      color="primary"
      onClick={submitReview}
      className="mt-4"
    >
      Submit Review
    </Button>
  </div>
</div>

    </div>
  );
};

export default ProductPage;
