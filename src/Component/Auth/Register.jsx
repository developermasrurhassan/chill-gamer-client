import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { FaEnvelope, FaLock, FaUser, FaGoogle, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa6';
import { useAuth } from './AuthContext';
import { UseTheme } from '../ThemeControl/ThemeContext';


const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { register, googleLogin, githubLogin } = useAuth();
    const { isDark } = UseTheme();
    const navigate = useNavigate();

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

        if (!formData.name.trim()) {
            newErrors.name = 'Full name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase and lowercase letters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const result = await register(formData.email, formData.password, formData.name);
            if (result.success) {
                navigate('/');
            }
        } catch (error) {
            console.error('Registration error:', error);
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
                navigate('/');
            }
        } catch (error) {
            console.error(`${provider} registration error:`, error);
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
                        Join Chill Gamer
                    </h2>
                    <p className={`${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                        Create your account and start gaming
                    </p>
                </div>

                {/* Social Registration Buttons */}
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

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'
                            }`}>
                            Full Name
                        </label>
                        <div className="relative">
                            <FaUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-white/40' : 'text-gray-400'
                                }`} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${errors.name
                                    ? 'border-red-500 focus:border-red-500'
                                    : isDark
                                        ? 'bg-white/5 border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
                                        : 'bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                                    } ${isDark ? 'text-white placeholder-white/40' : 'text-gray-900 placeholder-gray-500'}`}
                            />
                        </div>
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

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
                                placeholder="Create a password"
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
                        <p className={`mt-1 text-xs ${isDark ? 'text-white/40' : 'text-gray-500'
                            }`}>
                            Must be at least 6 characters with uppercase & lowercase letters
                        </p>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'
                            }`}>
                            Confirm Password
                        </label>
                        <div className="relative">
                            <FaLock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-white/40' : 'text-gray-400'
                                }`} />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-200 ${errors.confirmPassword
                                    ? 'border-red-500 focus:border-red-500'
                                    : isDark
                                        ? 'bg-white/5 border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
                                        : 'bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                                    } ${isDark ? 'text-white placeholder-white/40' : 'text-gray-900 placeholder-gray-500'}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-white/40 hover:text-white/60' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Terms Agreement */}
                    <div className="flex items-start space-x-3">
                        <input
                            type="checkbox"
                            required
                            className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'
                            }`}>
                            I agree to the{' '}
                            <Link to="/terms" className="text-primary hover:underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="text-primary hover:underline">
                                Privacy Policy
                            </Link>
                        </label>
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
                                Creating Account...
                            </div>
                        ) : (
                            'Create Account'
                        )}
                    </motion.button>
                </form>

                {/* Sign In Link */}
                <div className={`text-center mt-6 ${isDark ? 'text-white/60' : 'text-gray-600'
                    }`}>
                    <span>Already have an account? </span>
                    <Link
                        to="auth/login"
                        className={`font-semibold transition-colors ${isDark
                            ? 'text-primary hover:text-primary/80'
                            : 'text-primary hover:text-primary/70'
                            }`}
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default Register;