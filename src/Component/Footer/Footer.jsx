import { motion } from 'motion/react';
import { UseTheme } from '../ThemeControl/ThemeContext';
import { FaApple, FaArrowUp, FaDiscord, FaGamepad, FaGooglePlay, FaHeadset, FaHeart, FaInstagram, FaRocket, FaSteam, FaTwitch, FaTwitter, FaUsers, FaWindows, FaYoutube } from 'react-icons/fa6';
import { FaShieldAlt } from 'react-icons/fa';


const Footer = () => {
    const { isDark } = UseTheme();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const footerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6
            }
        }
    };

    const socialLinks = [
        { icon: FaDiscord, href: "#", label: "Discord", color: "hover:text-[#5865F2]" },
        { icon: FaTwitter, href: "#", label: "Twitter", color: "hover:text-[#1DA1F2]" },
        { icon: FaTwitch, href: "#", label: "Twitch", color: "hover:text-[#9146FF]" },
        { icon: FaYoutube, href: "#", label: "YouTube", color: "hover:text-[#FF0000]" },
        { icon: FaInstagram, href: "#", label: "Instagram", color: "hover:text-[#E4405F]" },
        { icon: FaSteam, href: "#", label: "Steam", color: "hover:text-[#000000]" }
    ];

    const quickLinks = [
        { name: "About Us", href: "/about" },
        { name: "Game Reviews", href: "/reviews" },
        { name: "Community", href: "/community" },
        { name: "Support", href: "/support" },
        { name: "Blog", href: "/blog" },
        { name: "Careers", href: "/careers" }
    ];

    const gameCategories = [
        { name: "Action", href: "/games/action" },
        { name: "Adventure", href: "/games/adventure" },
        { name: "RPG", href: "/games/rpg" },
        { name: "Strategy", href: "/games/strategy" },
        { name: "Sports", href: "/games/sports" },
        { name: "Indie", href: "/games/indie" }
    ];

    const platformLinks = [
        { icon: FaWindows, name: "Windows", href: "/platform/windows" },
        { icon: FaApple, name: "macOS", href: "/platform/macos" },
        { icon: FaGooglePlay, name: "Android", href: "/platform/android" },
        { icon: FaApple, name: "iOS", href: "/platform/ios" }
    ];

    return (
        <motion.footer
            variants={footerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`relative overflow-hidden border-t ${isDark
                ? 'bg-linear-to-br from-gray-900 via-purple-900/20 to-gray-900 border-gray-800'
                : 'bg-linear-to-br from-slate-50 via-blue-50/50 to-slate-50 border-gray-200'
                }`}
        >
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                {/* Floating shapes */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-10 left-10 opacity-10"
                >
                    <FaGamepad className="text-6xl text-purple-500" />
                </motion.div>

                <motion.div
                    animate={{
                        y: [0, 15, 0],
                        rotate: [0, -5, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-20 right-20 opacity-10"
                >
                    <FaGamepad className="text-4xl text-blue-500" />
                </motion.div>
            </div>

            {/* Main Footer Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

                    {/* Brand Column */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-1"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                                className="text-primary"
                            >
                                <FaGamepad className="text-3xl" />
                            </motion.div>
                            <span className="text-2xl font-black bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                                ChillGamer
                            </span>
                        </div>

                        <p className={`mb-6 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            Join the ultimate gaming community. Discover, play, and share your gaming
                            experiences with millions of gamers worldwide.
                        </p>

                        {/* Stats */}
                        <div className="flex gap-6 mb-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">10M+</div>
                                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Gamers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-accent">5K+</div>
                                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Games</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-secondary">150+</div>
                                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Countries</div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    variants={itemVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{
                                        scale: 1.2,
                                        y: -5
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`p-3 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${isDark
                                        ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        : 'bg-black/5 border-black/10 text-gray-600 hover:bg-black/10'
                                        } ${social.color}`}
                                    aria-label={social.label}
                                >
                                    <social.icon className="text-xl" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div variants={itemVariants}>
                        <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <motion.li
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <a
                                        href={link.href}
                                        className={`group flex items-center gap-2 transition-all duration-300 ${isDark
                                            ? 'text-gray-400 hover:text-white'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {link.name}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Game Categories */}
                    <motion.div variants={itemVariants}>
                        <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                            Game Categories
                        </h3>
                        <ul className="space-y-3">
                            {gameCategories.map((category, index) => (
                                <motion.li
                                    key={category.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <a
                                        href={category.href}
                                        className={`group flex items-center gap-2 transition-all duration-300 ${isDark
                                            ? 'text-gray-400 hover:text-white'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <span className="w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {category.name}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Platforms & Support */}
                    <motion.div variants={itemVariants}>
                        <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                            Platforms
                        </h3>
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {platformLinks.map((platform, index) => (
                                <motion.a
                                    key={platform.name}
                                    href={platform.href}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    className={`flex items-center gap-2 p-3 rounded-xl transition-all duration-300 ${isDark
                                        ? 'bg-white/5 hover:bg-white/10'
                                        : 'bg-black/5 hover:bg-black/10'
                                        }`}
                                >
                                    <platform.icon className="text-lg" />
                                    <span className="text-sm font-medium">{platform.name}</span>
                                </motion.a>
                            ))}
                        </div>

                        {/* Support Features */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <FaShieldAlt className="text-green-500 text-lg" />
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Safe & Secure
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaRocket className="text-blue-500 text-lg" />
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Fast Loading
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaUsers className="text-purple-500 text-lg" />
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    24/7 Community
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaHeadset className="text-orange-500 text-lg" />
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Live Support
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Newsletter Section */}
                <motion.div
                    variants={itemVariants}
                    className={`rounded-2xl p-8 mb-8 backdrop-blur-sm border ${isDark
                        ? 'bg-linear-to-r from-purple-900/30 to-blue-900/30 border-purple-500/20'
                        : 'bg-linear-to-r from-blue-100 to-purple-100 border-blue-200'
                        }`}
                >
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                Stay Updated!
                            </h3>
                            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                Get the latest game reviews, news, and exclusive content delivered to your inbox.
                            </p>
                        </div>
                        <div className="flex gap-3 w-full lg:w-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={`flex-1 px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${isDark
                                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:bg-white/10'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white'
                                    }`}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-linear-to-r from-primary to-accent text-white font-semibold rounded-xl shadow-lg hover:shadow-primary/25 transition-all duration-300"
                            >
                                Subscribe
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Bar */}
                <motion.div
                    variants={itemVariants}
                    className={`pt-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'
                        }`}
                >
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                        <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                            <span>© 2024 ChillGamer. Made with</span>
                            <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <FaHeart className="text-red-500" />
                            </motion.span>
                            <span>for gamers worldwide</span>
                        </div>

                        <div className="flex items-center gap-6">
                            <a href="/privacy" className={`text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                                }`}>
                                Privacy Policy
                            </a>
                            <a href="/terms" className={`text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                                }`}>
                                Terms of Service
                            </a>
                            <a href="/cookies" className={`text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                                }`}>
                                Cookie Policy
                            </a>
                        </div>

                        {/* Scroll to Top Button */}
                        <motion.button
                            onClick={scrollToTop}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 ${isDark
                                ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                : 'bg-black/5 border-black/10 text-gray-600 hover:bg-black/10'
                                }`}
                            aria-label="Scroll to top"
                        >
                            <FaArrowUp />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default Footer;