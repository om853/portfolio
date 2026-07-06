import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const TiltCard = ({ children, className = '' }) => {
    const ref = useRef(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const rotateX = ((clientY - centerY) / (height / 2)) * -8;
        const rotateY = ((clientX - centerX) / (width / 2)) * 8;
        setRotation({ x: rotateX, y: rotateY });
    };

    const reset = () => setRotation({ x: 0, y: 0 });

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{
                rotateX: rotation.x,
                rotateY: rotation.y,
                transformPerspective: 1000,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default TiltCard;