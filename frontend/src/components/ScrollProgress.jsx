import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

const ScrollProgress = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const scaleX = useSpring(0, { stiffness: 100, damping: 30, restDelta: 0.001 });

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
            setScrollProgress(progress);
            scaleX.set(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scaleX]);

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gray-400 via-gray-600 to-gray-900 dark:from-gray-600 dark:via-gray-400 dark:to-white origin-left z-[60]"
            style={{ scaleX }}
        />
    );
};

export default ScrollProgress;