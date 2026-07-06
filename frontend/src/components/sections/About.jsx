import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import TiltCard from '../TiltCard';

const About = () => {
    const { t } = useLanguage();
    const { scrollYProgress } = useScroll();
    
    // Parallax effects
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]);

    return (
        <section className="py-24 sm:py-32 lg:py-40 bg-gray-50 dark:bg-slate-950 relative overflow-hidden" id="about">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-100 dark:from-[#11131d] to-transparent pointer-events-none" />
                    <motion.div 
                        style={{ y: y1 }}
                        className="absolute top-40 -left-20 w-72 h-72 bg-white/10 dark:bg-zinc-800/10 rounded-full blur-[100px] pointer-events-none"
                    />
                    <motion.div 
                        style={{ y: y2 }}
                        className="absolute bottom-40 -right-20 w-96 h-96 bg-gray-300/10 dark:bg-zinc-700/10 rounded-full blur-[120px] pointer-events-none"
                    />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                    
                    {/* Left Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-7 text-left"
                    >
                        <motion.div 
                            style={{ opacity }}
                            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gray-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-950/40 backdrop-blur-sm mb-8 shadow-sm"
                        >
                                <span className="w-2 h-2 rounded-full bg-white dark:bg-zinc-800"></span>
                                <span className="text-black dark:text-white font-bold tracking-widest text-[0.65rem] uppercase">{t('about_title')}</span>
                        </motion.div>
                        
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-black text-gray-900 dark:text-white mb-8 leading-[1.1] tracking-tighter">
                            {t('about_subtitle')}
                        </h2>
                        
                        <div className="space-y-6 text-gray-600 dark:text-gray-400 text-lg sm:text-xl font-body leading-relaxed">
                            <p>{t('about_p1')}</p>
                            <p>{t('about_p2')}</p>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-12 border-t border-gray-200 dark:border-slate-700/50">
                            {[
                                { label: 'Years Exp.', value: '2+' },
                                { label: 'Projects', value: '15+' },
                                { label: 'Tech Stack', value: '10+' },
                                { label: 'Satisfaction', value: '100%' }
                            ].map((stat, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className="flex flex-col gap-2"
                                >
                                    <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</span>
                                    <span className="text-[0.65rem] text-gray-900 dark:text-white uppercase tracking-widest font-bold">{stat.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                    
                    {/* Right Images Parallax */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-5 relative h-[600px] hidden lg:block"
                    >
                        <TiltCard className="absolute right-0 top-10 w-4/5 h-[450px] rounded-2xl overflow-hidden shadow-2xl z-20 border border-gray-200 dark:border-slate-700/50">
                            <motion.img 
                                style={{ y: y1 }}
                                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Coding setup"
                                className="w-full h-[150%] object-cover object-center absolute top-[-25%] grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent pointer-events-none" />
                        </TiltCard>
                        
                        <TiltCard className="absolute left-0 bottom-10 w-3/5 h-[350px] rounded-2xl overflow-hidden shadow-2xl z-10 border border-gray-200 dark:border-slate-700/50">
                            <motion.img 
                                style={{ y: y2 }}
                                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Code editor"
                                className="w-full h-[150%] object-cover object-center absolute top-[-25%] grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-black/10 dark:bg-white/10 mix-blend-overlay pointer-events-none" />
                        </TiltCard>
                    </motion.div>
                    
                </div>
            </div>
        </section>
    );
};

export default About;