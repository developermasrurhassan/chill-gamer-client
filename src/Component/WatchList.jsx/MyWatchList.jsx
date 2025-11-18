import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';

import { toast } from 'react-hot-toast';
import { useAuth } from '../Auth/AuthContext';
import { FaBookmark, FaEye, FaTrash } from 'react-icons/fa6';
import { apiService } from '../../Service/api';
import LoadingPage from '../CommonPage/LoadingPage';

const MyWatchlist = () => {
    const { user } = useAuth();
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadWatchlist();
        }
    }, [user]);

    const loadWatchlist = async () => {
        try {
            const data = await apiService.getWatchlist(user.email);
            setWatchlist(data);
        } catch (error) {
            console.error('Error loading watchlist:', error);
            toast.error('Failed to load watchlist');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWatchlist = async (itemId) => {
        try {
            await apiService.removeFromWatchlist(itemId);
            setWatchlist(prev => prev.filter(item => item._id !== itemId));
            toast.success('Removed from watchlist');
        } catch (error) {
            console.error('Error removing from watchlist:', error);
            toast.error('Failed to remove from watchlist');
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span
                key={index}
                className={index < rating ? 'text-yellow-500' : 'text-gray-300'}
            >
                ★
            </span>
        ));
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FaBookmark className="text-6xl text-warning mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4">Login Required</h2>
                    <p className="text-base-content/70 mb-6">
                        Please login to view your watchlist
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
            <LoadingPage />
        );
    }

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4">
                        <FaBookmark />
                        <span className="font-semibold">My Watchlist</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Saved Games</h1>
                    <p className="text-xl text-base-content/70">
                        Your personal collection of games to check out later
                    </p>
                </motion.div>

                {/* Watchlist Count */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="text-center">
                        <div className="stat">
                            <div className="stat-value text-primary">{watchlist.length}</div>
                            <div className="stat-title">Games in Watchlist</div>
                        </div>
                    </div>
                </motion.div>

                {/* Watchlist Grid */}
                <AnimatePresence>
                    {watchlist.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <FaBookmark className="text-6xl text-base-content/30 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Watchlist is empty</h3>
                            <p className="text-base-content/70 mb-6">
                                Start adding games to your watchlist to keep track of what you want to play next
                            </p>
                            <Link to="/reviews" className="btn btn-primary">
                                Browse Games
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {watchlist.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="card bg-base-200 shadow-lg hover:shadow-xl transition-all"
                                >
                                    <figure className="px-4 pt-4">
                                        <img
                                            src={item.gameCover}
                                            alt={item.gameTitle}
                                            className="rounded-xl h-48 w-full object-cover"
                                        />
                                    </figure>

                                    <div className="card-body">
                                        <h3 className="card-title text-lg">{item.gameTitle}</h3>

                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex items-center gap-1">
                                                {renderStars(item.rating)}
                                            </div>
                                            <span className="font-semibold">{item.rating}/5</span>
                                        </div>

                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="badge badge-outline">{item.genre}</span>
                                        </div>

                                        <div className="card-actions justify-between items-center">
                                            <Link
                                                to={`/review/${item.reviewId}`}
                                                className="btn btn-primary btn-sm gap-2"
                                            >
                                                <FaEye />
                                                Read Review
                                            </Link>

                                            <button
                                                onClick={() => handleRemoveFromWatchlist(item._id)}
                                                className="btn btn-ghost btn-sm btn-circle text-error"
                                                title="Remove from watchlist"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>

                                        <div className="text-xs text-base-content/60">
                                            Added on {new Date(item.addedAt).toLocaleDateString()}
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

export default MyWatchlist;