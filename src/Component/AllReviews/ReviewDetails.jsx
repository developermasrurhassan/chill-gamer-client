import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { FaStar, FaArrowLeft, FaBookmark, FaShare, FaCalendar, FaUser } from 'react-icons/fa6';
import { toast } from 'react-hot-toast';
import { useAuth } from '../Auth/AuthContext';
import { apiService } from '../../Service/api';
import LoadingPage from '../CommonPage/LoadingPage';

const ReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedReviews, setRelatedReviews] = useState([]);

  useEffect(() => {
    loadReviewDetails();
  }, [id]);

  const loadReviewDetails = async () => {
    try {
      const [reviewData, allReviews] = await Promise.all([
        apiService.getReviewById(id),
        apiService.getAllReviews()
      ]);

      setReview(reviewData);

      // Find related reviews (same genre)
      const related = allReviews
        .filter(r => r._id !== id && r.genre === reviewData.genre)
        .slice(0, 3);
      setRelatedReviews(related);
    } catch (error) {
      console.error('Error loading review:', error);
      toast.error('Review not found');
      navigate('/reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = async () => {
    if (!user) {
      toast.error('Please login to add to watchlist');
      return;
    }

    try {
      await apiService.addToWatchlist({
        userEmail: user.email,
        userName: user.displayName,
        reviewId: review._id,
        gameTitle: review.gameTitle,
        gameCover: review.gameCover,
        rating: review.rating,
        genre: review.genre
      });
      toast.success('Added to watchlist!');
    } catch (error) {
      toast.error('Already in watchlist');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`text-2xl ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <LoadingPage />
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Review not found</h2>
          <Link to="/reviews" className="btn btn-primary">
            Back to Reviews
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost gap-2"
          >
            <FaArrowLeft />
            Back
          </button>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Review Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-base-100 rounded-2xl"
            >
              {/* Game Cover */}
              <div className="relative mb-6">
                <img
                  src={review.gameCover}
                  alt={review.gameTitle}
                  className="w-full h-64 lg:h-80 object-cover rounded-2xl"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={handleAddToWatchlist}
                    className="btn btn-primary btn-circle"
                    title="Add to watchlist"
                  >
                    <FaBookmark />
                  </button>
                  <button className="btn btn-ghost btn-circle">
                    <FaShare />
                  </button>
                </div>
              </div>

              {/* Review Header */}
              <div className="mb-6">
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                  {review.gameTitle}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                    <span className="text-xl font-bold ml-2">
                      {review.rating}/5
                    </span>
                  </div>

                  <span className="badge badge-primary badge-lg">
                    {review.genre}
                  </span>

                  <div className="flex items-center gap-1 text-base-content/70">
                    <FaCalendar />
                    <span>{review.year}</span>
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 p-4 bg-base-200 rounded-xl">
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img src={review.userPhoto || '/default-avatar.png'} alt={review.userName} />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">{review.userName}</p>
                    <p className="text-sm text-base-content/70">
                      Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed whitespace-pre-line">
                  {review.description}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Related Reviews */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-8"
            >
              <h3 className="text-xl font-bold mb-4">Related Reviews</h3>

              {relatedReviews.length > 0 ? (
                <div className="space-y-4">
                  {relatedReviews.map(relatedReview => (
                    <Link
                      key={relatedReview._id}
                      to={`/review/${relatedReview._id}`}
                      className="block card card-side bg-base-200 shadow hover:shadow-md transition-shadow"
                    >
                      <figure className="w-20">
                        <img
                          src={relatedReview.gameCover}
                          alt={relatedReview.gameTitle}
                          className="h-20 w-full object-cover"
                        />
                      </figure>
                      <div className="card-body p-4">
                        <h4 className="card-title text-sm leading-tight">
                          {relatedReview.gameTitle}
                        </h4>
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-500 text-xs" />
                          <span className="text-xs font-semibold">
                            {relatedReview.rating}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-base-content/70">No related reviews found</p>
              )}

              {/* CTA */}
              <div className="mt-6 p-4 bg-primary text-primary-content rounded-xl">
                <h4 className="font-bold mb-2">Want to share your thoughts?</h4>
                <p className="text-sm mb-4">Join our community and write your own reviews!</p>
                <Link to="/add-review" className="btn btn-secondary btn-sm w-full">
                  Write a Review
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;