import { NavLink, Link } from 'react-router';
import { motion } from "motion/react";
import {
    FaGamepad,
    FaHome,
    FaStar,
    FaPlus,
    FaUser,
    FaBookmark,
    FaBars,
    FaSignOutAlt,
    FaSearch,
    FaFire,
    FaUsers,
    FaCog,
    FaMoon,
    FaSun
} from 'react-icons/fa';
import { useAuth } from '../../Auth/AuthContext';
import { UseTheme } from '../../ThemeControl/ThemeContext';
import { FaStreetView } from 'react-icons/fa6';

// Dynamic navigation configuration
const navigationConfig = {
    public: [
        { path: '/', label: 'Home', icon: <FaHome className="size-5" /> },
        { path: '/games', label: 'All games', icon: <FaGamepad className="size-5" /> },
        { path: '/reviews', label: 'All Reviews', icon: <FaStar className="size-5" /> },
        { path: '/trending', label: 'Trending', icon: <FaFire className="size-5" /> },
        { path: '/community', label: 'Community', icon: <FaUsers className="size-5" /> },
    ],
    authenticated: [
        { path: '/add-review', label: 'Add Review', icon: <FaPlus className="size-5" /> },
        { path: '/my-reviews', label: 'My Reviews', icon: <FaUser className="size-5" /> },
        { path: '/my-watchlist', label: 'Watch list', icon: <FaBookmark className="size-5" /> },
        { path: '/search', label: 'Search', icon: <FaSearch className="size-5" /> },
    ],
    admin: [
        { path: '/admin', label: 'Admin', icon: <FaCog className="size-5" /> },
    ]
};

const Navbar = () => {
    const { user, logout, getUserRole } = useAuth();
    const { theme, toggleTheme, isDark } = UseTheme();

    const handleLogout = () => {
        logout();
    };

    // Dynamic navigation links based on user status and role
    const getNavLinks = () => {
        const links = [...navigationConfig.public];

        if (user) {
            links.push(...navigationConfig.authenticated);

            // Add admin links if user has admin role
            if (getUserRole() === 'admin') {
                links.push(...navigationConfig.admin);
            }
        }

        return links;
    };

    const navLinks = getNavLinks();

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
            className={`navbar bg-base-100/95 backdrop-blur-xl supports-backdrop-blur:bg-base-100/95 sticky top-0 z-50 py-5 ${user ? "w-full px-8" : "max-w-7xl mx-auto"}`}
        >
            {/* Mobile menu button and logo */}
            <div className="navbar-start">
                {/* Mobile Menu Dropdown */}
                <div className="dropdown lg:hidden">
                    <div tabIndex={0} role="button" className="btn btn-ghost">
                        <FaBars className="size-5" />
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu menu-sm z-50 mt-3 w-72 rounded-box bg-base-100 p-4 shadow-2xl border border-base-300"
                    >
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <NavLink
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-lg ${isActive ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}`
                                    }
                                >
                                    {link.icon}
                                    <span className="font-medium">{link.label}</span>
                                </NavLink>
                            </li>
                        ))}

                        {/* Theme Toggle in Mobile Menu */}
                        <li className="mt-4 pt-4 border-t border-base-300">
                            <button
                                onClick={toggleTheme}
                                className="flex items-center gap-3 rounded-lg hover:bg-base-200 w-full p-3"
                            >
                                {isDark ? (
                                    <FaSun className="size-5 text-warning" />
                                ) : (
                                    <FaMoon className="size-5 text-info" />
                                )}
                                <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                            </button>
                        </li>

                        {/* User section in mobile menu */}
                        {user ? (
                            <>
                                <li className="mt-4 pt-4 border-t border-base-300">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-base-200">
                                        <div className="avatar">
                                            <div className="size-10 rounded-full">
                                                <img
                                                    src={user.photoURL || '/default-avatar.png'}
                                                    alt={user.displayName}
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">{user.displayName}</p>
                                            <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 rounded-lg text-error hover:bg-error hover:text-error-content mt-2"
                                    >
                                        <FaSignOutAlt className="size-5" />
                                        <span>Logout</span>
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="mt-4 pt-4 border-t border-base-300">
                                <Link
                                    to="auth/login"
                                    className="flex items-center gap-3 rounded-lg hover:bg-primary hover:text-primary-content"
                                >
                                    <FaUser className="size-5" />
                                    <span>Login / Register</span>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Logo */}
                <Link to="/" className="btn btn-ghost px-2 hover:bg-transparent">
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="text-primary"
                    >
                        <FaGamepad className="size-8" />
                    </motion.div>
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl font-black bg-linear-to-r from-primary to-accent bg-clip-text text-transparent"
                    >
                        Chill Gamer
                    </motion.span>
                </Link>
            </div>

            {/* Desktop navigation */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal gap-2">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <NavLink
                                to={link.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all duration-200 font-medium ${isActive
                                        ? 'bg-linear-to-r from-primary to-accent text-primary-content shadow-lg'
                                        : 'hover:bg-base-200 hover:shadow-md'
                                    }`
                                }
                            >
                                {link.icon}
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Desktop right section */}
            <div className="navbar-end gap-3">
                {/* Theme Toggle */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    className="btn btn-ghost btn-circle hidden sm:flex"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? (
                        <FaSun className="size-5 text-warning" />
                    ) : (
                        <FaMoon className="size-5 text-info" />
                    )}
                </motion.button>

                {/* User section */}
                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="size-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                                <img
                                    src={user.photoURL || '/default-avatar.png'}
                                    alt={user.displayName}
                                    className="object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu menu-sm z-50 mt-3 w-72 rounded-box bg-base-100 p-4 shadow-2xl border border-base-300">
                            <li className="p-3 border-b border-base-300">
                                <div className="flex items-center gap-3">
                                    <div className="avatar">
                                        <div className="size-12 rounded-full">
                                            <img
                                                src={user.photoURL || '/default-avatar.png'}
                                                alt={user.displayName}
                                                className="object-cover"
                                                referrerPolicy="no-referrer"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-base truncate">{user.displayName}</p>
                                        <p className="text-sm text-base-content/60 truncate">{user.email}</p>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <NavLink
                                    to="/my-reviews"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-lg ${isActive ? 'bg-base-200' : 'hover:bg-base-200'}`
                                    }
                                >
                                    <FaUser className="size-5" />
                                    My Reviews
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/my-watchlist"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-lg ${isActive ? 'bg-base-200' : 'hover:bg-base-200'}`
                                    }
                                >
                                    <FaBookmark className="size-5" />
                                    My Watchlist
                                </NavLink>
                            </li>
                            <li className="mt-2 pt-2 border-t border-base-300">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 rounded-lg text-error hover:bg-error hover:text-error-content w-full p-3"
                                >
                                    <FaSignOutAlt className="size-5" />
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Link to="auth/login" className="btn btn-ghost">
                            Login
                        </Link>
                        <Link to="auth/register" className="btn btn-primary">
                            Get Started
                        </Link>
                    </div>
                )}
            </div>



        </motion.nav>


    );
};

export default Navbar;