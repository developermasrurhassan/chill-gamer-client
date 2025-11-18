import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReviewCard from '../../ReviewCard/ReviewCard';
import { apiService } from '../../Service/api';
import { FaSearch } from 'react-icons/fa';
import LoadingPage from '../CommonPage/LoadingPage';

const AllReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState('newest');
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        loadReviews();
        loadGenres();
    }, []);

    useEffect(() => {
        filterAndSortReviews();
    }, [reviews, searchTerm, selectedGenre, minRating, sortBy]);


    const loadReviews = async () => {
        try {
            const data = await apiService.getAllReviews();
            setReviews(data);
        } catch (error) {
            console.error('Error loading reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadGenres = async () => {
        try {
            const data = await apiService.getGenres();
            // Ensure data is an array
            setGenres(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading genres:', error);
            // Fallback genres
            setGenres(['Action', 'Adventure', 'RPG', 'Strategy', 'Sports']);
        }
    };

    const filterAndSortReviews = () => {
        let filtered = reviews.filter(review => {
            const matchesSearch = review.gameTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGenre = selectedGenre === 'all' || review.genre === selectedGenre;
            const matchesRating = review.rating >= minRating;

            return matchesSearch && matchesGenre && matchesRating;
        });

        // Sort reviews
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'highest-rated':
                    return b.rating - a.rating;
                case 'lowest-rated':
                    return a.rating - b.rating;
                default:
                    return 0;
            }
        });

        setFilteredReviews(filtered);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedGenre('all');
        setMinRating(0);
        setSortBy('newest');
    };

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
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Game Reviews</h1>
                    <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                        Discover honest reviews from our gaming community
                    </p>
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-base-200 rounded-2xl p-6 mb-8"
                >
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="flex-1 w-full lg:w-auto">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-3 text-base-content/50" />
                                <input
                                    type="text"
                                    placeholder="Search games or reviews..."
                                    className="input input-bordered w-full pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Genre Filter */}
                        <div className="w-full lg:w-auto">
                            <select
                                className="select select-bordered w-full"
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                            >
                                <option value="all">All Genres</option>
                                {genres.map(genre => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Rating Filter */}
                        <div className="w-full lg:w-auto">
                            <select
                                className="select select-bordered w-full"
                                value={minRating}
                                onChange={(e) => setMinRating(Number(e.target.value))}
                            >
                                <option value={0}>Any Rating</option>
                                <option value={4}>4+ Stars</option>
                                <option value={3}>3+ Stars</option>
                                <option value={2}>2+ Stars</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="w-full lg:w-auto">
                            <select
                                className="select select-bordered w-full"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="highest-rated">Highest Rated</option>
                                <option value="lowest-rated">Lowest Rated</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        <button
                            onClick={clearFilters}
                            className="btn btn-ghost w-full lg:w-auto"
                        >
                            Clear Filters
                        </button>
                    </div>
                </motion.div>

                {/* Results Count */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-between mb-6"
                >
                    <p className="text-base-content/70">
                        Showing {filteredReviews.length} of {reviews.length} reviews
                    </p>
                </motion.div>

                {/* Reviews Grid */}
                <AnimatePresence>
                    {filteredReviews.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <FaSearch className="text-6xl text-base-content/30 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">No reviews found</h3>
                            <p className="text-base-content/70">Try adjusting your search criteria</p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredReviews.map((review, index) => (
                                <motion.div
                                    key={review._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    layout
                                >
                                    <ReviewCard review={review} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AllReviews;