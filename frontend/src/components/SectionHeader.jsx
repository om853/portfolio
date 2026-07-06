import React from 'react';
import { motion } from 'framer-motion';
import RevealText from './RevealText';

const SectionHeader = ({ index, title, subtitle, align = 'left' }) => {
    return (
        <div className={`mb-8 sm:mb-12 lg:mb-16 ${align === 'center' ? 'text-center' : ''}`}>
            {index && (
                <RevealText delay={0}>
                    <p className="text-gray-900 dark:text-white font-bold tracking-widest text-[0.75rem] uppercase mb-2 sm:mb-4">
                        {index}
                    </p>
                </RevealText>
            )}
            <RevealText delay={0.1}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-extrabold text-gray-900 dark:text-white">
                    {title}
                </h2>
            </RevealText>
            {subtitle && (
                <RevealText delay={0.2}>
                    <p className="text-gray-600 dark:text-[#adaaaa] text-sm sm:text-base lg:text-lg mt-2 sm:mt-4 max-w-xl">
                        {subtitle}
                    </p>
                </RevealText>
            )}
            <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className={`h-1 w-16 bg-gradient-to-r from-gray-900 dark:from-white to-gray-600 dark:to-gray-400 mt-4 sm:mt-6 ${align === 'center' ? 'mx-auto' : ''}`}
            />
        </div>
    );
};

export default SectionHeader;