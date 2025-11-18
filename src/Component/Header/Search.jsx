import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'react-router';
import { apiService } from '../../Service/api';
import { FaSearch } from 'react-icons/fa';
import { FaGamepad } from 'react-icons/fa6';
import ReviewCard from '../../ReviewCard/ReviewCard';
import LoadingPage from '../CommonPage/LoadingPage';


const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        query: searchParams.get('q') || '',
        genre: searchParams.get('genre') || '',
        minRating: searchParams.get('minRating') || 0
    });
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        loadGenres();
        // Only perform search if we have active filters
        if (filters.query || filters.genre || parseInt(filters.minRating) > 0) {
            performSearch();
        }
    }, []);

    useEffect(() => {
        // Update URL with current filters
        const params = new URLSearchParams();
        if (filters.query) params.set('q', filters.query);
        if (filters.genre) params.set('genre', filters.genre);
        if (filters.minRating) params.set('minRating', filters.minRating);
        setSearchParams(params);
    }, [filters, setSearchParams]);

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

    const performSearch = async () => {
        setLoading(true);
        try {
            const data = await apiService.searchReviews(
                filters.query,
                filters.genre,
                filters.minRating
            );
            setResults(data);
        } catch (error) {
            console.error('Error searching:', error);
            // If search endpoint fails, fallback to client-side filtering
            const allReviews = await apiService.getAllReviews();
            const filtered = allReviews.filter(review => {
                const matchesQuery = !filters.query ||
                    review.gameTitle.toLowerCase().includes(filters.query.toLowerCase()) ||
                    review.description.toLowerCase().includes(filters.query.toLowerCase());
                const matchesGenre = !filters.genre || review.genre === filters.genre;
                const matchesRating = !filters.minRating || review.rating >= parseInt(filters.minRating);

                return matchesQuery && matchesGenre && matchesRating;
            });
            setResults(filtered);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        performSearch();
    };

    const clearFilters = () => {
        setFilters({
            query: '',
            genre: '',
            minRating: 0
        });
        setResults([]);
    };

    const hasActiveFilters = filters.query || filters.genre || parseInt(filters.minRating) > 0;

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                        <FaSearch />
                        <span className="font-semibold">Advanced Search</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Find Your Next Game</h1>
                    <p className="text-xl text-base-content/70">
                        Search through hundreds of game reviews and recommendations
                    </p>
                </motion.div>

                {/* Search Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="bg-base-200 rounded-2xl p-6 mb-8"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
                        {/* Search Query */}
                        <div className="lg:col-span-2">
                            <label className="label">
                                <span className="label-text font-semibold">Search Games & Reviews</span>
                            </label>
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-3 text-base-content/50" />
                                <input
                                    type="text"
                                    placeholder="Enter game title or keywords..."
                                    className="input input-bordered w-full pl-10"
                                    value={filters.query}
                                    onChange={(e) => handleFilterChange('query', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Genre Filter */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Genre</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={filters.genre}
                                onChange={(e) => handleFilterChange('genre', e.target.value)}
                            >
                                <option value="">All Genres</option>
                                {genres.map(genre => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Rating Filter */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Min Rating</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={filters.minRating}
                                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                            >
                                <option value={0}>Any Rating</option>
                                <option value={4}>4+ Stars</option>
                                <option value={3}>3+ Stars</option>
                                <option value={2}>2+ Stars</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-6">
                        <button
                            type="submit"
                            className="btn btn-primary flex-1 gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <LoadingPage />
                                </>
                            ) : (
                                <>
                                    <FaSearch />
                                    Search Reviews
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="btn btn-ghost"
                            disabled={loading}
                        >
                            Clear
                        </button>
                    </div>
                </motion.form>

                {/* Results */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">
                            Search Results {results.length > 0 && `(${results.length})`}
                        </h2>

                        {results.length > 0 && (
                            <div className="text-sm text-base-content/70">
                                Found {results.length} review{results.length !== 1 ? 's' : ''}
                            </div>
                        )}
                    </div>

                    <AnimatePresence>
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="loading loading-spinner loading-lg text-primary"></div>
                                <p className="mt-4 text-base-content/70">Searching reviews...</p>
                            </div>
                        ) : results.length === 0 && hasActiveFilters ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12"
                            >
                                <FaGamepad className="text-6xl text-base-content/30 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold mb-2">No results found</h3>
                                <p className="text-base-content/70 mb-6">
                                    Try adjusting your search criteria or browse all reviews
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="btn btn-primary"
                                >
                                    Clear Search
                                </button>
                            </motion.div>
                        ) : results.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12"
                            >
                                <FaSearch className="text-6xl text-base-content/30 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold mb-2">Start Searching</h3>
                                <p className="text-base-content/70">
                                    Use the search filters above to find game reviews
                                </p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {results.map((review, index) => (
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
                </motion.div>
            </div>
        </div>
    );
};

export default Search;