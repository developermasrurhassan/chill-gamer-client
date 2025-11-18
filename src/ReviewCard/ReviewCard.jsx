import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import { useAuth } from '../Component/Auth/AuthContext';
import { apiService } from '../Service/api';
import { FaBookmark, FaEye, FaStar } from 'react-icons/fa6';

const ReviewCard = ({ review }) => {
    const { user } = useAuth();

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
                className={index < rating ? 'text-yellow-500' : 'text-gray-300'}
            />
        ));
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
        >
            <figure className="px-4 pt-4">
                <img
                    src={review.gameCover}
                    alt={review.gameTitle}
                    className="rounded-xl h-48 w-full object-cover"
                />
            </figure>

            <div className="card-body">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="card-title text-lg leading-tight">{review.gameTitle}</h3>
                    <button
                        onClick={handleAddToWatchlist}
                        className="btn btn-ghost btn-sm btn-circle"
                        title="Add to watchlist"
                    >
                        <FaBookmark className="text-lg" />
                    </button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                    </div>
                    <span className="text-sm font-semibold">{review.rating}/5</span>
                    <span className="text-sm text-base-content/60">•</span>
                    <span className="text-sm text-base-content/60">{review.year}</span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                    <span className="badge badge-primary">{review.genre}</span>
                </div>

                <p className="text-base-content/70 line-clamp-2 mb-4">
                    {review.description}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="avatar">
                            <div className="w-8 rounded-full">
                                <img src={review.userPhoto || '/default-avatar.png'} alt={review.userName} />
                            </div>
                        </div>
                        <span className="text-sm font-medium">{review.userName}</span>
                    </div>

                    <Link
                        to={`/review/${review._id}`}
                        className="btn btn-primary btn-sm"
                    >
                        <FaEye className="text-sm" />
                        Read More
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default ReviewCard;