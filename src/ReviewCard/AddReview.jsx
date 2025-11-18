import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { useAuth } from '../Component/Auth/AuthContext';
import { apiService } from '../Service/api';
import { FaCheck, FaGamepad, FaStar, FaUpload } from 'react-icons/fa6';

const AddReview = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedGame, setSelectedGame] = useState('');
    const [formData, setFormData] = useState({
        gameTitle: '',
        gameCover: '',
        description: '',
        rating: 5,
        year: new Date().getFullYear(),
        genre: ''
    });

    useEffect(() => {
        loadGames();
    }, []);

    const loadGames = async () => {
        try {
            const data = await apiService.getAllGames();
            setGames(data);
        } catch (error) {
            console.error('Error loading games:', error);
        }
    };

    const handleGameSelect = (gameTitle) => {
        const game = games.find(g => g.title === gameTitle);
        if (game) {
            setFormData(prev => ({
                ...prev,
                gameTitle: game.title,
                gameCover: game.coverImage,
                year: game.releaseYear,
                genre: game.genre[0]
            }));
            setSelectedGame(gameTitle);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRatingChange = (rating) => {
        setFormData(prev => ({
            ...prev,
            rating
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please login to write a review');
            return;
        }

        if (!formData.gameTitle || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            const reviewData = {
                ...formData,
                userEmail: user.email,
                userName: user.displayName,
                userPhoto: user.photoURL
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

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FaGamepad className="text-6xl text-warning mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4">Login Required</h2>
                    <p className="text-base-content/70 mb-6">
                        Please login to write a review and join our gaming community!
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="btn btn-primary"
                    >
                        Login to Continue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                            <FaUpload />
                            <span className="font-semibold">Write Review</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Share Your Gaming Experience</h1>
                        <p className="text-xl text-base-content/70">
                            Help other gamers discover amazing games with your honest review
                        </p>
                    </div>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        onSubmit={handleSubmit}
                        className="bg-base-200 rounded-2xl p-6 lg:p-8"
                    >
                        {/* Game Selection */}
                        <div className="mb-6">
                            <label className="label">
                                <span className="label-text font-semibold">Select Game *</span>
                            </label>
                            <select
                                value={selectedGame}
                                onChange={(e) => handleGameSelect(e.target.value)}
                                className="select select-bordered w-full"
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
                        {formData.gameCover && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-6 p-4 bg-base-100 rounded-xl"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={formData.gameCover}
                                        alt={formData.gameTitle}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div>
                                        <h3 className="font-bold text-lg">{formData.gameTitle}</h3>
                                        <p className="text-base-content/70">
                                            {formData.year} • {formData.genre}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Rating */}
                        <div className="mb-6">
                            <label className="label">
                                <span className="label-text font-semibold">Your Rating *</span>
                            </label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRatingChange(star)}
                                        className="btn btn-ghost btn-circle"
                                    >
                                        <FaStar
                                            className={`text-2xl ${star <= formData.rating ? 'text-yellow-500' : 'text-gray-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 font-semibold">{formData.rating}/5</span>
                            </div>
                        </div>

                        {/* Review Description */}
                        <div className="mb-6">
                            <label className="label">
                                <span className="label-text font-semibold">Your Review *</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Share your thoughts about the game... What did you love? What could be improved? How was the gameplay, story, and graphics?"
                                className="textarea textarea-bordered w-full h-40"
                                required
                            />
                            <div className="label">
                                <span className="label-text-alt">
                                    {formData.description.length}/1000 characters
                                </span>
                            </div>
                        </div>

                        {/* Custom Game Fields (if game not in list) */}
                        {!selectedGame && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-4 mb-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">Game Title *</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="gameTitle"
                                            value={formData.gameTitle}
                                            onChange={handleInputChange}
                                            placeholder="Enter game title"
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">Game Cover URL</span>
                                        </label>
                                        <input
                                            type="url"
                                            name="gameCover"
                                            value={formData.gameCover}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com/image.jpg"
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">Release Year</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="year"
                                            value={formData.year}
                                            onChange={handleInputChange}
                                            min="1990"
                                            max={new Date().getFullYear()}
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">Genre</span>
                                        </label>
                                        <select
                                            name="genre"
                                            value={formData.genre}
                                            onChange={handleInputChange}
                                            className="select select-bordered w-full"
                                        >
                                            <option value="">Select Genre</option>
                                            <option value="Action">Action</option>
                                            <option value="Adventure">Adventure</option>
                                            <option value="RPG">RPG</option>
                                            <option value="Strategy">Strategy</option>
                                            <option value="Sports">Sports</option>
                                            <option value="Racing">Racing</option>
                                            <option value="Horror">Horror</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/reviews')}
                                className="btn btn-ghost flex-1"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary flex-1 gap-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="loading loading-spinner loading-sm"></div>
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <FaCheck />
                                        Publish Review
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.form>
                </motion.div>
            </div>
        </div>
    );
};

export default AddReview;