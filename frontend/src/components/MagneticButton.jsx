import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const MagneticButton = ({ children, className = '', ...props }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const deltaX = (clientX - centerX) / 2;
        const deltaY = (clientY - centerY) / 2;
        setPosition({ x: deltaX, y: deltaY });
    };

    const reset = () => setPosition({ x: 0, y: 0 });

    const isButton = typeof children === 'object' && children.$$typeof && children.$$typeof === Symbol.for('react.element');
    const ElementType = isButton ? 'button' : 'div';

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
            className={`${className} cursor-pointer`} // Make wrapper clickable
            {...props}
        >
            {isButton
                ? React.cloneElement(children, {
                      ...children.props,
                      className: `${children.props.className || ''} w-full cursor-pointer`, // Ensure button fills container
                      onClick: (e) => {
                          // Prevent event bubbling if needed
                          children.props.onClick?.(e);
                      }
                  })
                : children}
        </motion.div>
    );
};

export default MagneticButton;