import { motion } from 'motion/react';
import { Outlet, Link } from 'react-router';
import { UseTheme } from '../ThemeControl/ThemeContext';
import { FaGamepad, FaMoon, FaSun } from 'react-icons/fa6';

const AuthLayout = () => {
    const { isDark } = UseTheme();

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDark
            ? 'bg-linear-to-br from-slate-900 via-purple-900 to-slate-900'
            : 'bg-linear-to-br from-blue-50 via-purple-50 to-cyan-50'
            }`}>


            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating Shapes */}
                <motion.div
                    animate={{ y: [0, -30, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/6 w-16 h-16 bg-linear-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 blur-xl"
                />
                <motion.div
                    animate={{ y: [0, 40, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-1/3 right-1/5 w-20 h-20 bg-linear-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"
                />
                <motion.div
                    animate={{ x: [0, 50, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-1/2 left-1/3 w-12 h-12 bg-linear-to-r from-green-400 to-emerald-400 rounded-full opacity-20 blur-xl"
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8"
                    >
                        <Link to="/" className="inline-flex items-center gap-3 group">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                className="text-primary"
                            >
                                <FaGamepad className="text-4xl" />
                            </motion.div>
                            <span className={`text-3xl font-black bg-linear-to-r from-primary to-accent bg-clip-text text-transparent ${isDark ? '' : 'from-blue-600 to-purple-600'
                                }`}>
                                Chill Gamer
                            </span>
                        </Link>
                        <p className={`mt-2 text-sm ${isDark ? 'text-white/60' : 'text-gray-600'
                            }`}>
                            Join the ultimate gaming community
                        </p>
                    </motion.div>

                    {/* Auth Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </div>

            {/* Background Grid */}
            <div className="absolute inset-0">
                <div className={`absolute inset-0 ${isDark
                    ? 'bg-[linear-linear(rgba(255,255,255,0.02)_1px,transparent_1px),linear-linear(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]'
                    : 'bg-[linear-linear(rgba(0,0,0,0.02)_1px,transparent_1px),linear-linear(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)]'
                    } bg-size-[40px_40px] mask-[radial-linear(ellipse_60%_50%_at_50%_50%,black,transparent)]`} />
            </div>
        </div>
    );
};

export default AuthLayout;