import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { FaStar, FaArrowLeft, FaGamepad, FaSave } from 'react-icons/fa';
import { apiService } from '../../Service/api';
import { useAuth } from '../Auth/AuthContext';
import toast from 'react-hot-toast';

const ReviewForm = () => {
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        gameTitle: searchParams.get('game') || '',
        rating: 5,
        description: '',
        genre: '',
        year: new Date().getFullYear()
    });

    useEffect(() => {
        loadGames();
    }, []);

    const loadGames = async () => {
        try {
            const gamesData = await apiService.getAllGames();
            setGames(gamesData);
        } catch (error) {
            console.error('Error loading games:', error);
            toast.error('Failed to load games');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please login to write a review');
            navigate('/login');
            return;
        }

        if (!formData.gameTitle || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const reviewData = {
                gameTitle: formData.gameTitle,
                gameCover: games.find(g => g.title === formData.gameTitle)?.coverImage || '',
                description: formData.description,
                rating: formData.rating,
                year: formData.year,
                genre: formData.genre || games.find(g => g.title === formData.gameTitle)?.genre[0] || 'Action',
                userEmail: user.email,
                userName: user.displayName || user.email,
                userPhoto: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=random`
            };

            await apiService.createReview(reviewData);
            toast.success('Review published successfully!');
            navigate('/reviews');
        } catch (error) {
            console.error('Error creating review:', error);
            toast.error('Failed to publish review');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const selectedGame = games.find(g => g.title === formData.gameTitle);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
                    <p className="text-base-content/70 mb-6">Please login to write a review</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="btn btn-primary"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-ghost mb-6 gap-2"
                    >
                        <FaArrowLeft />
                        Back
                    </button>

                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                            <FaGamepad />
                            <span className="font-semibold">Write Review</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Share Your Experience</h1>
                        <p className="text-xl text-base-content/70">
                            Help other gamers by sharing your honest review
                        </p>
                    </div>
                </motion.div>

                {/* Review Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="bg-base-200 rounded-2xl p-8"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Game Selection */}
                        <div className="space-y-6">
                            {/* Game Selection */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold text-lg">Select Game *</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={formData.gameTitle}
                                    onChange={(e) => handleInputChange('gameTitle', e.target.value)}
                                    required
                                >
                                    <option value="">Choose a game...</option>
                                    {games.map(game => (
                                        <option key={game._id} value={game.title}>
                                            {game.title} ({game.releaseYear})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Game Preview */}
                            {selectedGame && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-base-300 rounded-xl p-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={selectedGame.coverImage}
                                            alt={selectedGame.title}
                                            className="w-16 h-20 object-cover rounded-lg"
                                        />
                                        <div>
                                            <h3 className="font-bold text-lg">{selectedGame.title}</h3>
                                            <p className="text-base-content/70">{selectedGame.developer}</p>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {selectedGame.genre.slice(0, 2).map(genre => (
                                                    <span key={genre} className="badge badge-sm badge-outline">
                                                        {genre}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Rating */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold text-lg">Your Rating *</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <motion.button
                                            key={star}
                                            type="button"
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                            className={`text-3xl ${star <= formData.rating ? 'text-yellow-400' : 'text-base-content/30'}`}
                                            onClick={() => handleInputChange('rating', star)}
                                        >
                                            <FaStar className="fill-current" />
                                        </motion.button>
                                    ))}
                                    <span className="ml-2 text-lg font-bold">
                                        {formData.rating}.0/5.0
                                    </span>
                                </div>
                            </div>

                            {/* Genre */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold text-lg">Genre</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={formData.genre}
                                    onChange={(e) => handleInputChange('genre', e.target.value)}
                                >
                                    <option value="">Select genre...</option>
                                    <option value="Action">Action</option>
                                    <option value="Adventure">Adventure</option>
                                    <option value="RPG">RPG</option>
                                    <option value="Strategy">Strategy</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Racing">Racing</option>
                                    <option value="Horror">Horror</option>
                                    <option value="Simulation">Simulation</option>
                                </select>
                            </div>

                            {/* Year */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold text-lg">Played In</span>
                                </label>
                                <input
                                    type="number"
                                    className="input input-bordered w-full"
                                    value={formData.year}
                                    onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                                    min={1990}
                                    max={new Date().getFullYear()}
                                />
                            </div>
                        </div>

                        {/* Right Column - Review Content */}
                        <div className="space-y-6">
                            {/* Review Description */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold text-lg">Your Review *</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered w-full h-48 resize-none"
                                    placeholder="Share your experience with this game. What did you like? What could be improved? How was the gameplay, story, graphics, etc.?"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    required
                                />
                                <div className="text-sm text-base-content/50 mt-2">
                                    {formData.description.length}/1000 characters
                                </div>
                            </div>

                            {/* Review Tips */}
                            <div className="bg-primary/10 rounded-xl p-4">
                                <h4 className="font-bold text-primary mb-2">Review Tips</h4>
                                <ul className="text-sm text-primary/80 space-y-1">
                                    <li>• Be honest and objective</li>
                                    <li>• Mention both positives and negatives</li>
                                    <li>• Focus on gameplay, story, and performance</li>
                                    <li>• Avoid spoilers when possible</li>
                                </ul>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn btn-primary btn-lg w-full gap-2 shadow-lg"
                            >
                                {loading ? (
                                    <>
                                        <div className="loading loading-spinner loading-sm"></div>
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        Publish Review
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </motion.form>
            </div>
        </div>
    );
};

export default ReviewForm;