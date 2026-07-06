import React from 'react';
import { motion } from 'framer-motion';

const RevealText = ({ children, className = '', delay = 0, as = 'div' }) => {
    const Tag = motion[as] || motion.div;
    
    return (
        <div className={`overflow-hidden ${className}`}>
            <Tag
                initial={{ y: '100%', opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
            >
                {children}
            </Tag>
        </div>
    );
};

export default RevealText;