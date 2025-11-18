import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';

import { toast } from 'react-hot-toast';
import { useAuth } from '../Component/Auth/AuthContext';
import { FaGamepad, FaPlus, FaStar, FaTrash } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';
import { apiService } from '../Service/api';
import LoadingPage from '../Component/CommonPage/LoadingPage';

const MyReviews = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadMyReviews();
        }
    }, [user]);

    const loadMyReviews = async () => {
        try {
            const data = await apiService.getUserReviews(user.email);
            setReviews(data);
        } catch (error) {
            console.error('Error loading reviews:', error);
            toast.error('Failed to load your reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            await apiService.deleteReview(reviewId);
            setReviews(prev => prev.filter(review => review._id !== reviewId));
            toast.success('Review deleted successfully');
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Failed to delete review');
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <FaStar
                key={index}
                className={index < rating ? 'text-yellow-500' : 'text-gray-300'}
            />
        ));
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FaGamepad className="text-6xl text-warning mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4">Login Required</h2>
                    <p className="text-base-content/70 mb-6">
                        Please login to view and manage your reviews
                    </p>
                    <Link to="/login" className="btn btn-primary">
                        Login to Continue
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
           <LoadingPage/>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8"
                >
                    <div>
                        <h1 className="text-4xl font-bold mb-2">My Reviews</h1>
                        <p className="text-xl text-base-content/70">
                            Manage and edit your game reviews
                        </p>
                    </div>

                    <Link to="/add-review" className="btn btn-primary btn-lg gap-2 mt-4 lg:mt-0">
                        <FaPlus />
                        Write New Review
                    </Link>
                </motion.div>

                {/* Reviews Count */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-figure text-primary">
                                <FaGamepad className="text-2xl" />
                            </div>
                            <div className="stat-title">Total Reviews</div>
                            <div className="stat-value text-primary">{reviews.length}</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <FaStar className="text-2xl" />
                            </div>
                            <div className="stat-title">Average Rating</div>
                            <div className="stat-value text-secondary">
                                {reviews.length > 0
                                    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
                                    : '0.0'
                                }
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Reviews List */}
                <AnimatePresence>
                    {reviews.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <FaGamepad className="text-6xl text-base-content/30 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">No reviews yet</h3>
                            <p className="text-base-content/70 mb-6">
                                Start sharing your gaming experiences with the community
                            </p>
                            <Link to="/add-review" className="btn btn-primary">
                                Write Your First Review
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid gap-6">
                            {reviews.map((review, index) => (
                                <motion.div
                                    key={review._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="card lg:card-side bg-base-200 shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <figure className="lg:w-48">
                                        <img
                                            src={review.gameCover}
                                            alt={review.gameTitle}
                                            className="h-48 lg:h-full w-full object-cover"
                                        />
                                    </figure>

                                    <div className="card-body">
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                            <div className="flex-1">
                                                <h2 className="card-title text-xl mb-2">
                                                    {review.gameTitle}
                                                </h2>

                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(review.rating)}
                                                        <span className="font-semibold ml-1">{review.rating}/5</span>
                                                    </div>

                                                    <span className="badge badge-primary">{review.genre}</span>
                                                    <span className="text-base-content/70">{review.year}</span>
                                                </div>

                                                <p className="text-base-content/70 line-clamp-2">
                                                    {review.description}
                                                </p>

                                                <div className="text-sm text-base-content/60 mt-2">
                                                    Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/review/${review._id}`}
                                                    className="btn btn-ghost btn-sm"
                                                >
                                                    View
                                                </Link>

                                                <button
                                                    onClick={() => {/* Implement edit */ }}
                                                    className="btn btn-primary btn-sm gap-1"
                                                    disabled
                                                >
                                                    <FaEdit />
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteReview(review._id)}
                                                    className="btn btn-error btn-sm gap-1"
                                                >
                                                    <FaTrash />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MyReviews;