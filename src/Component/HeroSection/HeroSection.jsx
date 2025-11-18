import { motion } from 'motion/react';
import { FaPlay, FaUsers, FaGlobe, FaMobile, FaGamepad, FaStar } from 'react-icons/fa6';
import { UseTheme } from '../ThemeControl/ThemeContext'; // ✅ Change to useTheme
import { Link } from 'react-router';

const HeroSection = () => {
    const { isDark } = UseTheme(); // ✅ Change to useTheme

    return (
        <section className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-500 ${isDark
            ? 'bg-linear-to-br from-slate-900 via-purple-900 to-slate-900'
            : 'bg-linear-to-br from-blue-50 via-purple-50 to-cyan-50'
            }`}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                {/* Floating Game Consoles */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="absolute top-20 left-10"
                >
                    <div className="w-20 h-12 bg-linear-to-r from-blue-500 to-cyan-400 rounded-lg rotate-12 shadow-2xl shadow-blue-500/30">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-2 left-3 opacity-60"></div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="absolute bottom-32 right-16"
                >
                    <div className="w-16 h-10 bg-linear-to-r from-green-500 to-emerald-400 rounded-lg -rotate-12 shadow-2xl shadow-green-500/30">
                        <div className="w-3 h-3 bg-white rounded-full absolute top-2 left-3 opacity-60"></div>
                    </div>
                </motion.div>

                {/* Floating Game Characters */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 right-1/4"
                >
                    <div className="w-8 h-8 bg-linear-to-r from-yellow-400 to-orange-500 rounded-full shadow-2xl shadow-orange-500/40"></div>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-1/3 left-1/4"
                >
                    <div className="w-6 h-6 bg-linear-to-r from-pink-500 to-rose-500 rounded-full shadow-2xl shadow-pink-500/40"></div>
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className={`inline-flex items-center gap-2 backdrop-blur-sm rounded-full px-6 py-3 border mb-8 ${isDark
                            ? 'bg-white/10 border-white/20 text-white/90'
                            : 'bg-black/10 border-black/20 text-gray-700'
                            }`}
                    >
                        <FaStar className={isDark ? "text-yellow-400" : "text-orange-500"} />
                        <span className="text-sm font-medium">#1 Gaming Community Platform</span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className={`text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'
                            }`}
                    >
                        <span className="bg-linear-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                            Play
                        </span>
                        <br />
                        <span className={isDark ? 'text-white' : 'text-gray-900'}>with anyone,</span>
                        <br />
                        <span className="bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                            anywhere,
                        </span>
                        <br />
                        <span className={isDark ? 'text-white' : 'text-gray-900'}>on any device.</span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className={`text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed ${isDark ? 'text-white/80' : 'text-gray-700'
                            }`}
                    >
                        Join millions of gamers worldwide. Discover new games, share your experiences,
                        and connect with the ultimate gaming community.
                    </motion.p>

                    {/* Feature Icons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="flex flex-wrap justify-center gap-8 mb-12"
                    >
                        {[
                            { icon: FaUsers, text: "10M+ Gamers", color: "text-blue-400" },
                            { icon: FaGlobe, text: "150+ Countries", color: "text-green-400" },
                            { icon: FaMobile, text: "Any Device", color: "text-purple-400" },
                            { icon: FaGamepad, text: "5K+ Games", color: "text-orange-400" }
                        ].map((item, index) => (
                            <motion.div
                                key={item.text}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className={`flex items-center gap-3 backdrop-blur-sm rounded-2xl px-6 py-4 border ${isDark
                                    ? 'bg-white/5 border-white/10'
                                    : 'bg-black/5 border-black/10'
                                    }`}
                            >
                                <item.icon className={`text-2xl ${item.color}`} />
                                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {item.text}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group bg-linear-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-3"
                        >
                            <Link to="/trending" className="flex items-center gap-3">
                                <FaPlay className="text-sm" />
                                Start Gaming Now
                            </Link>
                            <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="group-hover:translate-x-1 transition-transform"
                            >
                                →
                            </motion.span>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to="/games"

                                className={`px-8 py-4 rounded-2xl font-bold text-lg border transition-all duration-300 ${isDark
                                    ? 'bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20'
                                    : 'bg-black/10 backdrop-blur-sm text-gray-900 border-black/20 hover:bg-black/20'
                                    }`}>
                                Explore Games
                            </Link>

                        </motion.div>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.5 }}
                        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`w-6 h-10 border-2 rounded-full flex justify-center ${isDark ? 'border-white/30' : 'border-gray-400/30'
                                }`}
                        >
                            <motion.div
                                animate={{ y: [0, 12, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`w-1 h-3 rounded-full mt-2 ${isDark ? 'bg-white/50' : 'bg-gray-600/50'
                                    }`}
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Animated Background Grid */}
            <div className="absolute inset-0">
                <div className={`absolute inset-0 ${isDark
                    ? 'bg-[linear-linear(rgba(255,255,255,0.03)_1px,transparent_1px),linear-linear(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]'
                    : 'bg-[linear-linear(rgba(0,0,0,0.03)_1px,transparent_1px),linear-linear(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]'
                    } bg-size-[64px_64px] mask-[radial-linear(ellipse_80%_50%_at_50%_50%,black,transparent)]`} />
            </div>

            {/* linear Orbs */}
            <div className={`absolute top-1/2 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${isDark ? 'bg-blue-500/20' : 'bg-blue-500/10'
                }`}></div>
            <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 ${isDark ? 'bg-purple-500/20' : 'bg-purple-500/10'
                }`}></div>
            <div className={`absolute top-1/3 right-1/3 w-64 h-64 rounded-full blur-3xl animate-pulse delay-500 ${isDark ? 'bg-cyan-500/20' : 'bg-cyan-500/10'
                }`}></div>
        </section>
    );
};

export default HeroSection;