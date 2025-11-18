import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
    FaStar,
    FaShoppingCart,
    FaCalendarAlt,
    FaGamepad,
    FaUser,
    FaArrowLeft,
    FaPlus,
    FaShare,
    FaHeart,
    FaRegHeart
} from 'react-icons/fa';
import { apiService } from '../../Service/api';
import LoadingPage from '../CommonPage/LoadingPage';
import toast from 'react-hot-toast';
import { useAuth } from '../Auth/AuthContext';

const GameDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [watchlistLoading, setWatchlistLoading] = useState(false);

    useEffect(() => {
        loadGameDetails();
    }, [id]);

    useEffect(() => {
        if (game && user) {
            checkWatchlistStatus();
        }
    }, [game, user]);

    const loadGameDetails = async () => {
        try {
            const allGames = await apiService.getAllGames();
            const foundGame = allGames.find(g => g._id === id);
            setGame(foundGame);

            if (foundGame) {
                loadGameReviews(foundGame.title);
            }
        } catch (error) {
            console.error('Error loading game details:', error);
            toast.error('Failed to load game details');
        } finally {
            setLoading(false);
        }
    };

    const loadGameReviews = async (gameTitle) => {
        try {
            const allReviews = await apiService.getAllReviews();
            const gameReviews = allReviews.filter(review =>
                review.gameTitle === gameTitle
            );
            setReviews(gameReviews);
        } catch (error) {
            console.error('Error loading reviews:', error);
        }
    };

    const checkWatchlistStatus = async () => {
        try {
            const watchlist = await apiService.getWatchlist(user.email);
            const isInList = watchlist.some(item => item.gameTitle === game.title);
            setIsInWatchlist(isInList);
        } catch (error) {
            console.error('Error checking watchlist:', error);
        }
    };

    const handleAddToWatchlist = async () => {
        if (!user) {
            toast.error('Please login to add to watchlist');
            navigate('/login');
            return;
        }

        setWatchlistLoading(true);
        try {
            if (isInWatchlist) {
                // Remove from watchlist
                const watchlist = await apiService.getWatchlist(user.email);
                const watchlistItem = watchlist.find(item => item.gameTitle === game.title);
                if (watchlistItem) {
                    await apiService.removeFromWatchlist(watchlistItem._id);
                    setIsInWatchlist(false);
                    toast.success('Removed from watchlist!');
                }
            } else {
                // Add to watchlist
                await apiService.addToWatchlist({
                    userEmail: user.email,
                    userName: user.displayName || user.email,
                    gameTitle: game.title,
                    gameCover: game.coverImage,
                    rating: game.rating,
                    genre: game.genre[0],
                    price: game.price,
                    releaseYear: game.releaseYear,
                    platforms: game.platforms
                });
                setIsInWatchlist(true);
                toast.success('Added to watchlist!');
            }
        } catch (error) {
            console.error('Watchlist error:', error);
            toast.error(isInWatchlist ? 'Failed to remove from watchlist' : 'Failed to add to watchlist');
        } finally {
            setWatchlistLoading(false);
        }
    };

    const handleBuyNow = () => {
        if (!user) {
            toast.error('Please login to purchase games');
            navigate('/login');
            return;
        }
        navigate(`/buy/${id}`);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: game.title,
                    text: `Check out ${game.title} on Chill Gamer!`,
                    url: window.location.href,
                });
                toast.success('Game shared!');
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return 'text-green-500';
        if (rating >= 4.0) return 'text-blue-500';
        if (rating >= 3.0) return 'text-yellow-500';
        return 'text-red-500';
    };

    const formatPrice = (price) => {
        return price === 0 ? 'Free to Play' : `$${price}`;
    };

    const getRatingText = (rating) => {
        if (rating >= 4.5) return 'Exceptional';
        if (rating >= 4.0) return 'Recommended';
        if (rating >= 3.0) return 'Average';
        return 'Below Average';
    };

    if (loading) {
        return <LoadingPage />;
    }

    if (!game) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Game Not Found</h2>
                    <button
                        onClick={() => navigate('/games')}
                        className="btn btn-primary"
                    >
                        Back to Games
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="container mx-auto px-4">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => navigate('/games')}
                    className="btn btn-ghost mb-6 gap-2 hover:bg-base-300 transition-all"
                >
                    <FaArrowLeft />
                    Back to Games
                </motion.button>

                {/* Game Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-linear-to-br from-base-200 to-base-300 rounded-3xl p-8 mb-8 shadow-2xl border border-base-300"
                >
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Game Cover */}
                        <motion.div
                            className="shrink-0"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <img
                                src={game.coverImage}
                                alt={game.title}
                                className="w-80 h-96 object-cover rounded-2xl shadow-2xl border-4 border-white/10"
                            />
                        </motion.div>

                        {/* Game Info */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        {game.title}
                                    </h1>
                                    <p className="text-xl text-base-content/70 mb-4">
                                        {game.developer}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="btn btn-ghost btn-circle hover:bg-base-300"
                                        onClick={handleShare}
                                    >
                                        <FaShare />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`btn btn-ghost btn-circle ${isInWatchlist ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}`}
                                        onClick={handleAddToWatchlist}
                                        disabled={watchlistLoading}
                                    >
                                        {watchlistLoading ? (
                                            <div className="loading loading-spinner loading-sm"></div>
                                        ) : isInWatchlist ? (
                                            <FaHeart />
                                        ) : (
                                            <FaRegHeart />
                                        )}
                                    </motion.button>
                                </div>
                            </div>

                            {/* Rating and Price */}
                            <div className="flex items-center gap-6 mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`flex items-center gap-2 text-2xl font-bold ${getRatingColor(game.rating)}`}>
                                        <FaStar className="fill-current" />
                                        <span>{game.rating}/5.0</span>
                                    </div>
                                    <div className="badge badge-lg badge-primary">
                                        {getRatingText(game.rating)}
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-primary">
                                    {formatPrice(game.price)}
                                </div>
                            </div>

                            {/* Game Details Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="flex items-center gap-2 bg-base-100/50 rounded-lg p-3">
                                    <FaCalendarAlt className="text-primary" />
                                    <span className="font-semibold">{game.releaseYear}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-base-100/50 rounded-lg p-3">
                                    <FaGamepad className="text-primary" />
                                    <span className="font-semibold">{game.genre[0]}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-base-100/50 rounded-lg p-3">
                                    <FaUser className="text-primary" />
                                    <span className="font-semibold">Single Player</span>
                                </div>
                                <div className="flex items-center gap-2 bg-primary/20 text-primary rounded-lg p-3 font-semibold">
                                    {game.platforms[0]}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleBuyNow}
                                    className="btn btn-primary btn-lg gap-2 flex-1 shadow-lg"
                                >
                                    <FaShoppingCart />
                                    {game.price === 0 ? 'Play Now' : 'Buy Now'}
                                </motion.button>

                                {/* // In GameDetails.jsx, update the Write Review button: */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn btn-outline btn-lg gap-2 hover:bg-base-300"
                                    onClick={() => navigate(`/reviews/new?game=${game.title}`)}
                                >
                                    <FaPlus />
                                    Write Review
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="tabs tabs-boxed bg-base-200 p-1 rounded-2xl">
                        <button
                            className={`tab tab-lg rounded-xl transition-all ${activeTab === 'overview' ? 'tab-active bg-primary text-primary-content shadow-lg' : 'hover:bg-base-300'}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        <button
                            className={`tab tab-lg rounded-xl transition-all ${activeTab === 'reviews' ? 'tab-active bg-primary text-primary-content shadow-lg' : 'hover:bg-base-300'}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews ({reviews.length})
                        </button>
                        <button
                            className={`tab tab-lg rounded-xl transition-all ${activeTab === 'details' ? 'tab-active bg-primary text-primary-content shadow-lg' : 'hover:bg-base-300'}`}
                            onClick={() => setActiveTab('details')}
                        >
                            Details
                        </button>
                    </div>
                </motion.div>

                {/* Tab Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Description */}
                            <div className="lg:col-span-2">
                                <h3 className="text-2xl font-bold mb-4">About the Game</h3>
                                <p className="text-lg leading-relaxed text-base-content/80">{game.description}</p>

                                {/* Key Features */}
                                <div className="mt-8">
                                    <h4 className="text-xl font-bold mb-4">Key Features</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-3 bg-base-200 rounded-xl">
                                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                                            <span>Immersive Storyline</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-base-200 rounded-xl">
                                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                                            <span>Stunning Graphics</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-base-200 rounded-xl">
                                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                                            <span>Open World Exploration</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-base-200 rounded-xl">
                                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                                            <span>Multiplayer Support</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Genres */}
                                <div className="bg-base-200 rounded-2xl p-6">
                                    <h4 className="font-bold mb-4 text-lg">Genres</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {game.genre.map(genre => (
                                            <span key={genre} className="badge badge-primary badge-lg px-3 py-2">
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Platforms */}
                                <div className="bg-base-200 rounded-2xl p-6">
                                    <h4 className="font-bold mb-4 text-lg">Platforms</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {game.platforms.map(platform => (
                                            <span key={platform} className="badge badge-outline badge-lg px-3 py-2">
                                                {platform}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="bg-base-200 rounded-2xl p-6">
                                    <h4 className="font-bold mb-4 text-lg">Quick Stats</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span>Rating</span>
                                            <span className="font-bold text-primary">{game.rating}/5</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Release Year</span>
                                            <span className="font-bold">{game.releaseYear}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Price</span>
                                            <span className="font-bold text-secondary">{formatPrice(game.price)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            {reviews.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-12"
                                >
                                    <FaStar className="text-6xl text-base-content/30 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold mb-2">No Reviews Yet</h3>
                                    <p className="text-base-content/70 mb-6">Be the first to review this game!</p>
                                    {user ? (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => navigate(`/reviews/new?game=${game.title}`)}
                                        >
                                            Write First Review
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => navigate('/login')}
                                        >
                                            Login to Review
                                        </button>
                                    )}
                                </motion.div>
                            ) : (
                                <div className="space-y-6">
                                    {reviews.map((review, index) => (
                                        <motion.div
                                            key={review._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-base-200 rounded-2xl p-6 hover:shadow-lg transition-all"
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <img
                                                    src={review.userPhoto}
                                                    alt={review.userName}
                                                    className="w-12 h-12 rounded-full border-2 border-primary/20"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg">{review.userName}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`flex items-center gap-1 ${getRatingColor(review.rating)}`}>
                                                            <FaStar className="fill-current" />
                                                            <span className="font-bold">{review.rating}</span>
                                                        </div>
                                                        <span className="text-base-content/50">•</span>
                                                        <span className="text-base-content/50">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-base-content/80 leading-relaxed">{review.description}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-base-200 rounded-2xl p-6"
                            >
                                <h3 className="text-xl font-bold mb-4">Game Information</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-base-300/50 rounded-lg">
                                        <span className="text-base-content/70">Developer:</span>
                                        <span className="font-medium">{game.developer}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-base-300/50 rounded-lg">
                                        <span className="text-base-content/70">Release Date:</span>
                                        <span className="font-medium">{game.releaseYear}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-base-300/50 rounded-lg">
                                        <span className="text-base-content/70">Genre:</span>
                                        <span className="font-medium">{game.genre.join(', ')}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-base-300/50 rounded-lg">
                                        <span className="text-base-content/70">Platforms:</span>
                                        <span className="font-medium">{game.platforms.join(', ')}</span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-base-200 rounded-2xl p-6"
                            >
                                <h3 className="text-xl font-bold mb-4">System Requirements</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-base-300/50 rounded-lg">
                                        <span className="text-base-content/70">OS:</span>
                                        <span className="font-medium">Windows 10/11</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-base-300/50 rounded-lg">
                                        <span className="text-base-content/70">Processor:</span>
                                        <span className="font-medium">Intel i5 or AMD equivalent</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-base-300/50 rounded-lg">
                                        <span className="text-base-content/70">Memory:</span>
                                        <span className="font-medium">8 GB RAM</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-base-300/50 rounded-lg">
                                        <span className="text-base-content/70">Graphics:</span>
                                        <span className="font-medium">GTX 1060 / RX 580</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-base-300/50 rounded-lg">
                                        <span className="text-base-content/70">Storage:</span>
                                        <span className="font-medium">50 GB available space</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default GameDetails;