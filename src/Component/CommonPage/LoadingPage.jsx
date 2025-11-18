import { motion } from 'motion/react';
import { FaGamepad } from 'react-icons/fa6';

const LoadingPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1, repeat: Infinity }
                    }}
                    className="mb-6"
                >
                    <FaGamepad className="text-6xl text-primary mx-auto" />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold mb-4"
                >
                    Loading Chill Gamer
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center gap-1"
                >
                    {[0, 1, 2].map((index) => (
                        <motion.div
                            key={index}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: index * 0.2
                            }}
                            className="w-2 h-2 bg-primary rounded-full"
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoadingPage;