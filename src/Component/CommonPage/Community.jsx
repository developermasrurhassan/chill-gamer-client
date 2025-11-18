import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { apiService } from '../../Service/api';
import { FaComment, FaGamepad, FaStar, FaTrophy, FaUsers } from 'react-icons/fa6';
import { FaUserFriends } from 'react-icons/fa';
import LoadingPage from './LoadingPage';


const Community = () => {
    const [recentReviews, setRecentReviews] = useState([]);
    const [topReviewers, setTopReviewers] = useState([]);
    const [stats, setStats] = useState({
        totalReviews: 0,
        totalUsers: 0,
        averageRating: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCommunityData();
    }, []);

    const loadCommunityData = async () => {
        try {
            const [reviews, games] = await Promise.all([
                apiService.getAllReviews(),
                apiService.getAllGames()
            ]);

            // Get recent reviews (last 6)
            const recent = reviews
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 6);

            // Calculate top reviewers
            const reviewerStats = reviews.reduce((acc, review) => {
                if (!acc[review.userEmail]) {
                    acc[review.userEmail] = {
                        name: review.userName,
                        photo: review.userPhoto,
                        reviewCount: 0,
                        totalRating: 0
                    };
                }
                acc[review.userEmail].reviewCount++;
                acc[review.userEmail].totalRating += review.rating;
                return acc;
            }, {});

            const topReviewersList = Object.values(reviewerStats)
                .map(reviewer => ({
                    ...reviewer,
                    averageRating: reviewer.totalRating / reviewer.reviewCount
                }))
                .sort((a, b) => b.reviewCount - a.reviewCount)
                .slice(0, 6);

            setRecentReviews(recent);
            setTopReviewers(topReviewersList);
            setStats({
                totalReviews: reviews.length,
                totalUsers: Object.keys(reviewerStats).length,
                averageRating: reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
            });
        } catch (error) {
            console.error('Error loading community data:', error);
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
            <section className="bg-linear-to-r from-purple-500 to-pink-500 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
                            <FaUsers className="text-2xl" />
                            <span className="font-bold text-lg">OUR COMMUNITY</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Gamers Unite
                        </h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Join thousands of passionate gamers sharing their experiences,
                            discoveries, and love for gaming.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                {/* Community Stats */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="stat bg-base-200 rounded-2xl text-center">
                            <div className="stat-figure text-primary">
                                <FaGamepad className="text-3xl" />
                            </div>
                            <div className="stat-value text-primary">{stats.totalReviews}</div>
                            <div className="stat-title">Game Reviews</div>
                        </div>

                        <div className="stat bg-base-200 rounded-2xl text-center">
                            <div className="stat-figure text-secondary">
                                <FaUserFriends className="text-3xl" />
                            </div>
                            <div className="stat-value text-secondary">{stats.totalUsers}</div>
                            <div className="stat-title">Active Members</div>
                        </div>

                        <div className="stat bg-base-200 rounded-2xl text-center">
                            <div className="stat-figure text-accent">
                                <FaStar className="text-3xl" />
                            </div>
                            <div className="stat-value text-accent">{stats.averageRating.toFixed(1)}</div>
                            <div className="stat-title">Average Rating</div>
                        </div>
                    </div>
                </motion.section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Recent Activity */}
                    <motion.section
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                    >
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <FaComment className="text-primary" />
                            Recent Activity
                        </h2>

                        <div className="space-y-4">
                            {recentReviews.map((review, index) => (
                                <motion.div
                                    key={review._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="card bg-base-200 shadow hover:shadow-md transition-shadow"
                                >
                                    <div className="card-body p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="avatar">
                                                <div className="w-10 rounded-full">
                                                    <img src={review.userPhoto || '/default-avatar.png'} alt={review.userName} />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold">{review.userName}</span>
                                                    <span className="text-xs text-base-content/60">
                                                        reviewed {review.gameTitle}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="flex gap-1">
                                                        {Array.from({ length: 5 }, (_, i) => (
                                                            <FaStar
                                                                key={i}
                                                                className={`text-sm ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="badge badge-sm">{review.genre}</span>
                                                </div>
                                                <p className="text-sm text-base-content/70 line-clamp-2">
                                                    {review.description}
                                                </p>
                                                <div className="text-xs text-base-content/60 mt-2">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Top Reviewers */}
                    <motion.section
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                    >
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <FaTrophy className="text-yellow-500" />
                            Top Reviewers
                        </h2>

                        <div className="space-y-4">
                            {topReviewers.map((reviewer, index) => (
                                <motion.div
                                    key={reviewer.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="card bg-base-200 shadow hover:shadow-md transition-shadow"
                                >
                                    <div className="card-body p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="avatar">
                                                <div className="w-14 rounded-full">
                                                    <img src={reviewer.photo || '/default-avatar.png'} alt={reviewer.name} />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg">{reviewer.name}</h3>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <FaStar className="text-yellow-500" />
                                                        <span>{reviewer.averageRating.toFixed(1)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <FaGamepad className="text-primary" />
                                                        <span>{reviewer.reviewCount} reviews</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {index < 3 && (
                                                <div className={`badge badge-lg ${index === 0 ? 'badge-warning' :
                                                    index === 1 ? 'badge-secondary' :
                                                        'badge-accent'
                                                    }`}>
                                                    #{index + 1}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                </div>
            </div>
        </div>
    );
};

export default Community;