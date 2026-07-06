import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await api.get('/testimonials/');
                setTestimonials(response.data);
            } catch (error) {
                // silently fail
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    // For infinite scroll, we need enough items to fill the screen twice
    // If not enough testimonials, duplicate them
    const displayTestimonials = [...testimonials, ...testimonials, ...testimonials].slice(0, 9);

    if (loading && testimonials.length === 0) return null;
    if (testimonials.length === 0) return null;

    return (
        <section className="py-24 sm:py-32 relative overflow-hidden bg-white dark:bg-slate-950">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 dark:from-slate-950 to-transparent pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16 sm:mb-20">
                <div className={`flex flex-col items-center text-center max-w-2xl mx-auto`}>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-950/10 mb-6 shadow-sm"
                    >
                        <span className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white"></span>
                        <span className="text-gray-900 dark:text-white font-bold tracking-widest text-[0.65rem] uppercase">{t('testimonials_title')}</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-headline font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4"
                    >
                        {t('testimonials_headline')}
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed"
                    >
                        {t('testimonials_sub')}
                    </motion.p>
                </div>
            </div>

            {/* Infinite Carousel */}
            <div className="relative w-full overflow-hidden flex pb-12 pt-4">
                {/* Fade edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-20 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-20 pointer-events-none" />
                
                <motion.div 
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                    className="flex gap-6 sm:gap-8 px-4 w-max hover:[animation-play-state:paused]"
                >
                    {displayTestimonials.map((item, index) => (
                        <div 
                            key={`${item.id}-${index}`}
                            className="w-[320px] sm:w-[400px] shrink-0 p-8 sm:p-10 rounded-3xl glass border border-gray-200 dark:border-slate-700/50 relative group hover:-translate-y-2 transition-transform duration-300 shadow-xl text-left"
                        >
                            <span className="absolute top-6 right-6 text-8xl text-gray-200 dark:text-white/5 font-serif select-none leading-none group-hover:text-gray-900/20 dark:group-hover:text-white/20 transition-colors">"</span>
                            
                            <p className="text-gray-700 dark:text-gray-300 italic mb-8 relative z-10 leading-relaxed min-h-[100px] text-sm sm:text-base">"{item.message}"</p>
                            
                            <div className="flex items-center gap-4 border-t border-gray-200 dark:border-slate-700/50 pt-6">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 dark:border-slate-700/50 shrink-0 relative group-hover:border-gray-900 dark:group-hover:border-slate-300 transition-colors">
                                    <img 
                                        src={item.avatar || `https://ui-avatars.com/api/?name=${item.name}&background=000000&color=ffffff`} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-gray-900 dark:text-white font-bold text-sm uppercase tracking-tight">{item.name}</h4>
                                    <p className="text-gray-900 dark:text-white text-[0.65rem] font-bold uppercase tracking-widest mt-0.5">{item.position}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;