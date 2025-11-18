import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendar, FaFire, FaStar } from 'react-icons/fa6';
import { apiService } from '../../Service/api';
import ReviewCard from '../../ReviewCard/ReviewCard';
import LoadingPage from './LoadingPage';


const Trending = () => {
    const [trendingReviews, setTrendingReviews] = useState([]);
    const [popularGames, setPopularGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTrendingData();
    }, []);

    const loadTrendingData = async () => {
        try {
            const [reviews, games] = await Promise.all([
                apiService.getHighestRatedReviews(),
                apiService.getAllGames()
            ]);

            // Sort games by rating for trending
            const sortedGames = games
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 6);

            setTrendingReviews(reviews);
            setPopularGames(sortedGames);
        } catch (error) {
            console.error('Error loading trending data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <LoadingPage />
        );
    }

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <section className="bg-linear-to-r from-orange-500 to-red-500 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
                            <FaFire className="text-2xl" />
                            <span className="font-bold text-lg">TRENDING NOW</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            What's Hot in Gaming
                        </h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Discover the games everyone is talking about. From chart-topping hits to hidden gems going viral.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                {/* Top Rated Reviews */}
                <section className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            Community <span className="text-primary">Favorites</span>
                        </h2>
                        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                            The most loved games according to our passionate gaming community
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trendingReviews.map((review, index) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <ReviewCard review={review} />
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Popular Games */}
                <section>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            Popular <span className="text-secondary">Games</span>
                        </h2>
                        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                            Currently trending games with the highest ratings
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {popularGames.map((game, index) => (
                            <motion.div
                                key={game._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all"
                            >
                                <figure className="px-6 pt-6">
                                    <img
                                        src={game.coverImage}
                                        alt={game.title}
                                        className="rounded-xl h-64 w-full object-cover"
                                    />
                                </figure>
                                <div className="card-body">
                                    <h3 className="card-title text-xl mb-2">{game.title}</h3>

                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {game.genre.slice(0, 3).map(genre => (
                                            <span key={genre} className="badge badge-primary badge-sm">
                                                {genre}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaStar className="text-yellow-500" />
                                            <span className="font-bold text-lg">{game.rating}</span>
                                            <span className="text-base-content/70">/5.0</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-base-content/70">
                                            <FaCalendar />
                                            <span>{game.releaseYear}</span>
                                        </div>
                                    </div>

                                    <p className="text-base-content/70 line-clamp-2">
                                        {game.description}
                                    </p>

                                    <div className="card-actions justify-between items-center mt-4">
                                        <div className="text-sm text-base-content/60">
                                            {game.platforms.slice(0, 2).join(', ')}
                                        </div>
                                        <div className="font-bold text-primary">
                                            ${game.price}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Trending;