import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from '../AnimatedCounter';
import TiltCard from '../TiltCard';
import { useLanguage } from '../../context/LanguageContext';

const Statistics = () => {
    const { t } = useLanguage();

    const stats = [
        { label: 'Projects Built', target: '20', suffix: '+' },
        { label: 'Technologies', target: '14', suffix: '+' },
        { label: 'Years Experience', target: '2', suffix: '+' },
        { label: 'Client Satisfaction', target: '100', suffix: '%' }
    ];

    return (
        <section className="py-20 relative bg-gray-50 dark:bg-transparent overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/5 dark:from-white/5 to-gray-600/5 dark:to-gray-400/5 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <h2 className="sr-only">Statistics</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {stats.map((stat, idx) => (
                        <TiltCard key={stat.label} className="w-full">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                viewport={{ once: true, margin: "-50px" }}
                                className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700/50 flex flex-col items-center justify-center text-center group hover:border-gray-900/40 dark:hover:border-slate-500/30 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-gray-900/10 dark:hover:shadow-white/10"
                            >
                                <span className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-3 tracking-tighter group-hover:text-gradient transition-all duration-300">
                                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                                </span>
                                <p className="text-[0.65rem] sm:text-[0.75rem] text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] font-bold leading-tight">
                                    {stat.label}
                                </p>
                            </motion.div>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Statistics;
