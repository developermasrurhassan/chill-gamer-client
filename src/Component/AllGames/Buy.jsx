import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';

import { apiService } from '../../Service/api';
import { FaArrowLeft, FaCheck, FaClock, FaCreditCard, FaDownload, FaGoogle, FaPaypal, FaShield } from 'react-icons/fa6';
import { FaShoppingCart } from 'react-icons/fa';
import LoadingPage from '../CommonPage/LoadingPage';

const Buy = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [orderProcessing, setOrderProcessing] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);

    useEffect(() => {
        loadGameDetails();
    }, [id]);

    const loadGameDetails = async () => {
        try {
            const allGames = await apiService.getAllGames();
            const foundGame = allGames.find(g => g._id === id);
            setGame(foundGame);
        } catch (error) {
            console.error('Error loading game details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (e) => {
        e.preventDefault();
        setOrderProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setOrderProcessing(false);
            setOrderComplete(true);
        }, 3000);
    };

    const formatPrice = (price) => {
        return price === 0 ? 'Free' : `$${price}`;
    };

    if (loading) {
        return (
            <LoadingPage />
        );
    }

    if (!game) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Game Not Found</h2>
                    <button
                        onClick={() => navigate('/games')}
                        className="btn btn-primary"
                    >
                        Back to Games
                    </button>
                </div>
            </div>
        );
    }

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-base-100 py-8">
                <div className="container mx-auto px-4 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="bg-success/20 text-success rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                            <FaCheck className="text-3xl" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Purchase Complete!</h1>
                        <p className="text-xl text-base-content/70 mb-8">
                            Thank you for your purchase of <strong>{game.title}</strong>
                        </p>

                        <div className="bg-base-200 rounded-2xl p-6 mb-8">
                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src={game.coverImage}
                                    alt={game.title}
                                    className="w-20 h-24 object-cover rounded-lg"
                                />
                                <div className="text-left">
                                    <h3 className="text-xl font-bold">{game.title}</h3>
                                    <p className="text-base-content/70">{game.developer}</p>
                                    <p className="text-lg font-bold text-primary">
                                        {formatPrice(game.price)}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-base-content/70">
                                <div className="flex items-center gap-2">
                                    <FaDownload />
                                    <span>Game will be available in your library immediately</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaShield />
                                    <span>Purchase protected by Chill Gamer Guarantee</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigate('/library')}
                                className="btn btn-primary gap-2"
                            >
                                <FaDownload />
                                Go to Library
                            </button>
                            <button
                                onClick={() => navigate('/games')}
                                className="btn btn-outline"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="container mx-auto px-4">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => navigate(`/game/${id}`)}
                    className="btn btn-ghost mb-6 gap-2"
                >
                    <FaArrowLeft />
                    Back to Game
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-base-200 rounded-2xl p-8">
                            <h1 className="text-3xl font-bold mb-6">Complete Your Purchase</h1>

                            {/* Game Info */}
                            <div className="flex items-center gap-4 mb-8 p-4 bg-base-300 rounded-xl">
                                <img
                                    src={game.coverImage}
                                    alt={game.title}
                                    className="w-16 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold">{game.title}</h3>
                                    <p className="text-base-content/70">{game.developer}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">
                                        {formatPrice(game.price)}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-4">Payment Method</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <button
                                        className={`btn btn-outline h-24 flex-col gap-2 ${paymentMethod === 'card' ? 'btn-primary' : ''}`}
                                        onClick={() => setPaymentMethod('card')}
                                    >
                                        <FaCreditCard className="text-2xl" />
                                        Credit Card
                                    </button>
                                    <button
                                        className={`btn btn-outline h-24 flex-col gap-2 ${paymentMethod === 'paypal' ? 'btn-primary' : ''}`}
                                        onClick={() => setPaymentMethod('paypal')}
                                    >
                                        <FaPaypal className="text-2xl" />
                                        PayPal
                                    </button>
                                    <button
                                        className={`btn btn-outline h-24 flex-col gap-2 ${paymentMethod === 'google' ? 'btn-primary' : ''}`}
                                        onClick={() => setPaymentMethod('google')}
                                    >
                                        <FaGoogle className="text-2xl" />
                                        Google Pay
                                    </button>
                                </div>

                                {/* Payment Form */}
                                {paymentMethod === 'card' && (
                                    <form onSubmit={handlePurchase} className="space-y-4">
                                        <div>
                                            <label className="label">
                                                <span className="label-text font-semibold">Card Number</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="1234 5678 9012 3456"
                                                className="input input-bordered w-full"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="label">
                                                    <span className="label-text font-semibold">Expiry Date</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    className="input input-bordered w-full"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="label">
                                                    <span className="label-text font-semibold">CVV</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="123"
                                                    className="input input-bordered w-full"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="label">
                                                <span className="label-text font-semibold">Cardholder Name</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                className="input input-bordered w-full"
                                                required
                                            />
                                        </div>
                                    </form>
                                )}

                                {paymentMethod === 'paypal' && (
                                    <div className="text-center py-8">
                                        <FaPaypal className="text-6xl text-blue-500 mx-auto mb-4" />
                                        <p className="text-base-content/70">
                                            You will be redirected to PayPal to complete your payment
                                        </p>
                                    </div>
                                )}

                                {paymentMethod === 'google' && (
                                    <div className="text-center py-8">
                                        <FaGoogle className="text-6xl text-red-500 mx-auto mb-4" />
                                        <p className="text-base-content/70">
                                            You will be redirected to Google Pay to complete your payment
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Purchase Button */}
                            <button
                                onClick={handlePurchase}
                                disabled={orderProcessing}
                                className="btn btn-primary btn-lg w-full gap-2"
                            >
                                {orderProcessing ? (
                                    <>
                                        <div className="loading loading-spinner loading-sm"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FaShoppingCart />
                                        Complete Purchase - {formatPrice(game.price)}
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>

                    {/* Order Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Order Summary */}
                        <div className="bg-base-200 rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Game:</span>
                                    <span className="font-medium">{game.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Price:</span>
                                    <span className="font-medium">{formatPrice(game.price)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax:</span>
                                    <span className="font-medium">$0.00</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-3">
                                    <span>Total:</span>
                                    <span className="text-primary">{formatPrice(game.price)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="bg-base-200 rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4">What You Get</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <FaDownload className="text-success" />
                                    <span>Instant download access</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaShield className="text-success" />
                                    <span>DRM-free guarantee</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaClock className="text-success" />
                                    <span>Lifetime access</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaCheck className="text-success" />
                                    <span>Free updates</span>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="bg-base-200 rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4">Secure Payment</h3>
                            <p className="text-sm text-base-content/70 mb-4">
                                Your payment information is encrypted and secure. We do not store your credit card details.
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                                <FaShield className="text-success" />
                                <span>256-bit SSL encryption</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Buy;