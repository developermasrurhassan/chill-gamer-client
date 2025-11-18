import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../../Service/api';
import { Link, Navigate } from 'react-router';
import { FaGamepad, FaPlus, FaStar } from 'react-icons/fa6';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import LoadingPage from '../CommonPage/LoadingPage';

const AllGames = () => {
    const [games, setGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [selectedPlatform, setSelectedPlatform] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [genres, setGenres] = useState([]);
    const [platforms, setPlatforms] = useState([]);

    useEffect(() => {
        loadGames();
    }, []);

    useEffect(() => {
        filterAndSortGames();
    }, [games, searchTerm, selectedGenre, selectedPlatform, sortBy]);

    const loadGames = async () => {
        try {
            const data = await apiService.getAllGames();
            setGames(data);
            extractFilters(data);
        } catch (error) {
            console.error('Error loading games:', error);
        } finally {
            setLoading(false);
        }
    };

    const extractFilters = (gamesData) => {
        // Extract unique genres
        const allGenres = [...new Set(gamesData.flatMap(game => game.genre))];
        setGenres(allGenres);

        // Extract unique platforms
        const allPlatforms = [...new Set(gamesData.flatMap(game => game.platforms))];
        setPlatforms(allPlatforms);
    };

    const filterAndSortGames = () => {
        let filtered = games.filter(game => {
            const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                game.developer.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGenre = selectedGenre === 'all' || game.genre.includes(selectedGenre);
            const matchesPlatform = selectedPlatform === 'all' || game.platforms.includes(selectedPlatform);

            return matchesSearch && matchesGenre && matchesPlatform;
        });

        // Sort games
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return b.releaseYear - a.releaseYear;
                case 'oldest':
                    return a.releaseYear - b.releaseYear;
                case 'highest-rated':
                    return b.rating - a.rating;
                case 'lowest-rated':
                    return a.rating - b.rating;
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });

        setFilteredGames(filtered);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedGenre('all');
        setSelectedPlatform('all');
        setSortBy('newest');
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return 'text-green-500';
        if (rating >= 4.0) return 'text-blue-500';
        if (rating >= 3.0) return 'text-yellow-500';
        return 'text-red-500';
    };

    const formatPrice = (price) => {
        return price === 0 ? 'Free' : `$${price}`;
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
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                        <FaGamepad />
                        <span className="font-semibold">Game Library</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">All Games</h1>
                    <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                        Discover our complete collection of games with detailed information and ratings
                    </p>
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-base-200 rounded-2xl p-6 mb-8"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <label className="label">
                                <span className="label-text font-semibold">Search Games</span>
                            </label>
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-3 text-base-content/50" />
                                <input
                                    type="text"
                                    placeholder="Search by title or developer..."
                                    className="input input-bordered w-full pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                            >
                                <option value="all">All Genres</option>
                                {genres.map(genre => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Platform Filter */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Platform</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={selectedPlatform}
                                onChange={(e) => setSelectedPlatform(e.target.value)}
                            >
                                <option value="all">All Platforms</option>
                                {platforms.map(platform => (
                                    <option key={platform} value={platform}>{platform}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Sort By</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="highest-rated">Highest Rated</option>
                                <option value="lowest-rated">Lowest Rated</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="title-asc">Title: A-Z</option>
                                <option value="title-desc">Title: Z-A</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={clearFilters}
                            className="btn btn-ghost"
                        >
                            Clear Filters
                        </button>
                        <div className="flex-1"></div>
                        <div className="text-sm text-base-content/70">
                            {filteredGames.length} games found
                        </div>
                    </div>
                </motion.div>

                {/* Games Grid */}
                <AnimatePresence>
                    {filteredGames.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <FaSearch className="text-6xl text-base-content/30 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">No games found</h3>
                            <p className="text-base-content/70">Try adjusting your search criteria</p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredGames.map((game, index) => (
                                <motion.div
                                    key={game._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    layout
                                    className="card bg-base-200 hover:bg-base-300 transition-all duration-300 hover:shadow-xl"
                                >
                                    <figure className="px-4 pt-4">
                                        <img
                                            src={game.coverImage}
                                            alt={game.title}
                                            className="rounded-xl h-48 w-full object-cover"
                                        />
                                    </figure>
                                    <div className="card-body p-4">
                                        <h3 className="card-title text-lg font-bold line-clamp-1">
                                            {game.title}
                                        </h3>

                                        <div className="flex items-center justify-between mb-2">
                                            <div className={`flex items-center gap-1 font-bold ${getRatingColor(game.rating)}`}>
                                                <FaStar className="fill-current" />
                                                <span>{game.rating}</span>
                                            </div>
                                            <div className="badge badge-primary">
                                                {game.releaseYear}
                                            </div>
                                        </div>

                                        <p className="text-sm text-base-content/70 line-clamp-2 mb-3">
                                            {game.description}
                                        </p>

                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {game.genre.slice(0, 2).map(genre => (
                                                <span key={genre} className="badge badge-outline badge-sm">
                                                    {genre}
                                                </span>
                                            ))}
                                            {game.genre.length > 2 && (
                                                <span className="badge badge-outline badge-sm">
                                                    +{game.genre.length - 2}
                                                </span>
                                            )}
                                        </div>

                                        <div className="card-actions justify-between items-center">
                                            <div className="font-bold text-primary text-lg">
                                                {formatPrice(game.price)}
                                            </div>
                                            <div className="flex gap-2">


                                                <Link
                                                    className="btn btn-primary btn-sm gap-2"
                                                    to={`/game/${game._id}`}
                                                >
                                                    <FaPlus />
                                                    Details
                                                </Link>

                                                {game.price > 0 && (
                                                    <Link className="btn btn-outline btn-sm gap-2" to={`/buy/${game._id}`}>
                                                        <FaShoppingCart />
                                                        Buy
                                                    </Link>
                                                )}
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

export default AllGames;