import { motion } from 'motion/react';
import { FaHome, FaSearch } from 'react-icons/fa';
import { FaArrowLeft, FaGamepad } from 'react-icons/fa6';
import { Link } from 'react-router';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-2xl"
            >
                {/* Animated 404 */}
                <motion.div
                    animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, -5, 5, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    className="mb-8"
                >
                    <div className="text-9xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                        404
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <FaGamepad className="text-6xl text-warning mx-auto mb-4" />
                    <h1 className="text-4xl font-bold mb-4">Game Over!</h1>
                    <p className="text-xl text-base-content/70 mb-6">
                        The page you're looking for seems to have respawned elsewhere.
                        Don't worry, even the best gamers get lost sometimes!
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Link to="/" className="btn btn-primary btn-lg gap-2">
                        <FaHome />
                        Back to Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="btn btn-ghost btn-lg gap-2"
                    >
                        <FaArrowLeft />
                        Go Back
                    </button>

                    <Link to="/reviews" className="btn btn-outline btn-lg gap-2">
                        <FaSearch />
                        Browse Games
                    </Link>
                </motion.div>

                {/* Fun Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-12 p-6 bg-base-200 rounded-2xl"
                >
                    <h3 className="font-semibold mb-4">While you're here...</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <div className="font-bold text-primary">500+</div>
                            <div>Games Reviewed</div>
                        </div>
                        <div>
                            <div className="font-bold text-secondary">10K+</div>
                            <div>Active Gamers</div>
                        </div>
                        <div>
                            <div className="font-bold text-accent">4.8</div>
                            <div>Avg Rating</div>
                        </div>
                        <div>
                            <div className="font-bold text-warning">∞</div>
                            <div>Fun Times</div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default NotFound;