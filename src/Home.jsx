import { useEffect, useState } from "react";
import HeroSection from "./Component/HeroSection/HeroSection";
import { apiService } from './Service/api';
import { motion } from 'framer-motion';
import { FaArrowRight, FaFire, FaGamepad, FaStar, FaUsers } from "react-icons/fa6";
import ReviewCard from "./ReviewCard/ReviewCard";
import { Link } from "react-router";
import LoadingPage from "./Component/CommonPage/LoadingPage";

const Home = () => {

    const [highestRatedReviews, setHighestRatedReviews] = useState([]);
    const [trendingGames, setTrendingGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHomeData();
    }, []);

    const loadHomeData = async () => {
        try {
            const [reviews, games] = await Promise.all([
                apiService.getHighestRatedReviews(),
                apiService.getAllGames()
            ]);

            setHighestRatedReviews(reviews);
            setTrendingGames(games.slice(0, 4));
        } catch (error) {
            console.error('Error loading home data:', error);
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

        <div>
            <section><HeroSection /></section>
            {/* Highest Rated Games Section */}
            <section className="py-20 bg-base-100">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                            <FaStar className="text-yellow-500" />
                            <span className="font-semibold">Top Rated</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Highest Rated <span className="text-primary">Games</span>
                        </h2>
                        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                            Discover the most loved games according to our community of passionate gamers
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {highestRatedReviews.map((review, index) => (
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

                    <div className="text-center">
                        <Link to="/reviews" className="btn btn-primary btn-lg">
                            View All Reviews
                            <FaArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trending Games Section */}
            <section className="py-20 bg-base-200">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4">
                            <FaFire className="text-orange-500" />
                            <span className="font-semibold">Trending Now</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Popular <span className="text-secondary">Games</span>
                        </h2>
                        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                            Check out what everyone is playing right now
                        </p>


                    </motion.div>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {trendingGames.map((game, index) => (

                            <Link to={`/game/${game._id}`} key={game._id}>

                                <motion.div
                                    key={game._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
                                >
                                    <figure className="px-4 pt-4">
                                        <img
                                            src={game.coverImage}
                                            alt={game.title}
                                            className="rounded-xl h-48 w-full object-cover"
                                        />
                                    </figure>
                                    <div className="card-body">
                                        <h3 className="card-title text-lg">{game.title}</h3>
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {game.genre.slice(0, 2).map((genre) => (
                                                <span key={genre} className="badge badge-outline badge-sm">
                                                    {genre}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <FaStar className="text-yellow-500" />
                                                <span className="font-semibold">{game.rating}</span>
                                            </div>
                                            <span className="text-sm text-base-content/70">{game.releaseYear}</span>
                                        </div>
                                    </div>
                                </motion.div>

                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-linear-to-r from-primary to-secondary text-primary-content">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <FaUsers className="text-4xl mx-auto mb-4" />
                            <div className="text-3xl md:text-4xl font-bold mb-2">10K+</div>
                            <div className="text-lg">Active Gamers</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <FaGamepad className="text-4xl mx-auto mb-4" />
                            <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
                            <div className="text-lg">Game Reviews</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <FaStar className="text-4xl mx-auto mb-4" />
                            <div className="text-3xl md:text-4xl font-bold mb-2">4.8</div>
                            <div className="text-lg">Average Rating</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <FaFire className="text-4xl mx-auto mb-4" />
                            <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
                            <div className="text-lg">Games Covered</div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}


export default Home;