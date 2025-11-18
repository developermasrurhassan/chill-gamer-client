import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router';
import { FaEnvelope, FaLock, FaGoogle, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa6';
import { useAuth } from './AuthContext';
import { UseTheme } from '../ThemeControl/ThemeContext';


const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { login, googleLogin, githubLogin } = useAuth();
    const { isDark } = UseTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const result = await login(formData.email, formData.password);
            if (result.success) {
                navigate(from, { replace: true });
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        setIsLoading(true);
        try {
            const result = provider === 'google'
                ? await googleLogin()
                : await githubLogin();

            if (result.success) {
                navigate(from, { replace: true });
            }
        } catch (error) {
            console.error(`${provider} login error:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`w-full rounded-3xl backdrop-blur-xl border shadow-2xl ${isDark
                ? 'bg-white/5 border-white/10'
                : 'bg-white/80 border-white/20'
                }`}
        >
            <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                        Welcome Back
                    </h2>
                    <p className={`${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                        Sign in to your Chill Gamer account
                    </p>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3 mb-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSocialLogin('google')}
                        disabled={isLoading}
                        className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border transition-all duration-200 ${isDark
                            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <FaGoogle className={`text-lg ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                        <span className="font-medium">Continue with Google</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSocialLogin('github')}
                        disabled={isLoading}
                        className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border transition-all duration-200 ${isDark
                            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <FaGithub className="text-lg" />
                        <span className="font-medium">Continue with GitHub</span>
                    </motion.button>
                </div>

                {/* Divider */}
                <div className="flex items-center mb-6">
                    <div className={`flex-1 h-px ${isDark ? 'bg-white/20' : 'bg-gray-300'
                        }`} />
                    <span className={`px-4 text-sm ${isDark ? 'text-white/60' : 'text-gray-500'
                        }`}>
                        OR
                    </span>
                    <div className={`flex-1 h-px ${isDark ? 'bg-white/20' : 'bg-gray-300'
                        }`} />
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'
                            }`}>
                            Email Address
                        </label>
                        <div className="relative">
                            <FaEnvelope className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-white/40' : 'text-gray-400'
                                }`} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${errors.email
                                    ? 'border-red-500 focus:border-red-500'
                                    : isDark
                                        ? 'bg-white/5 border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
                                        : 'bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                                    } ${isDark ? 'text-white placeholder-white/40' : 'text-gray-900 placeholder-gray-500'}`}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'
                            }`}>
                            Password
                        </label>
                        <div className="relative">
                            <FaLock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-white/40' : 'text-gray-400'
                                }`} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-200 ${errors.password
                                    ? 'border-red-500 focus:border-red-500'
                                    : isDark
                                        ? 'bg-white/5 border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
                                        : 'bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                                    } ${isDark ? 'text-white placeholder-white/40' : 'text-gray-900 placeholder-gray-500'}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-white/40 hover:text-white/60' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                        )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className={`ml-2 text-sm ${isDark ? 'text-white/60' : 'text-gray-600'
                                }`}>
                                Remember me
                            </span>
                        </label>
                        <Link
                            to="/forgot-password"
                            className={`text-sm font-medium transition-colors ${isDark
                                ? 'text-primary hover:text-primary/80'
                                : 'text-primary hover:text-primary/70'
                                }`}
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-linear-to-r from-primary to-accent text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Signing In...
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </motion.button>
                </form>

                {/* Sign Up Link */}
                <div className={`text-center mt-6 ${isDark ? 'text-white/60' : 'text-gray-600'
                    }`}>
                    <span>Don't have an account? </span>
                    <Link
                        to="/auth/register"
                        className={`font-semibold transition-colors ${isDark
                            ? 'text-primary hover:text-primary/80'
                            : 'text-primary hover:text-primary/70'
                            }`}
                    >
                        Register
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default Login;