import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

const AnimatedCounter = ({ target, duration = 2, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        const numericTarget = parseInt(target.replace(/[^0-9]/g, ''), 10);
        if (isNaN(numericTarget)) {
            setCount(target);
            return;
        }

        let startTime;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * numericTarget));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [isInView, target, duration]);

    return (
        <span ref={ref}>
            {typeof count === 'number' ? `${count}${suffix}` : target}
        </span>
    );
};

export default AnimatedCounter;