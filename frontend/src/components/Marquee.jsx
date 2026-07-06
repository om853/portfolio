import React from 'react';
import { motion } from 'framer-motion';

const skills = [
    'HTML', 'CSS', 'JavaScript', 'jQuery', 'Bootstrap', 'Tailwind CSS',
    'React', 'ES6+', 'PHP', 'Laravel', 'OOP', 'MVC', 'JWT', 'Payment Integration'
];

const Marquee = () => {
    const doubledSkills = [...skills, ...skills];

    return (
        <div className="py-12 sm:py-16 overflow-hidden border-y border-white/5 bg-[#0e0e0e]">
            <div className="relative">
                <motion.div
                    className="flex gap-6 sm:gap-8 whitespace-nowrap"
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 25,
                            ease: 'linear',
                        },
                    }}
                >
                    {doubledSkills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-6 sm:gap-8 shrink-0">
                            <span className="text-lg sm:text-xl md:text-2xl font-headline font-bold text-white/20 uppercase tracking-wider">
                                {skill}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0"></span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Marquee;