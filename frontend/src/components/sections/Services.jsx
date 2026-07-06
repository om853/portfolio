import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../SectionHeader';
import { useLanguage } from '../../context/LanguageContext';

const Services = () => {
    const { t } = useLanguage();

    const services = [
        {
            title: 'Frontend Development',
            description: 'Building responsive, pixel-perfect interfaces with React, Tailwind CSS, and modern JavaScript. Focused on performance and user experience.',
            icon: 'devices',
            borderHover: 'hover:border-gray-900/30 dark:hover:border-white/30'
        },
        {
            title: 'Backend Development',
            description: 'Designing secure, scalable APIs and server-side applications with Laravel, PHP, and JWT authentication.',
            icon: 'architecture',
            borderHover: 'hover:border-gray-900/30 dark:hover:border-white/30'
        },
        {
            title: 'Full Stack Solutions',
            description: 'End-to-end web applications with payment integration, database design, and deployment. From concept to production.',
            icon: 'code',
            borderHover: 'hover:border-gray-900/30 dark:hover:border-white/30'
        }
    ];

    return (
        <section className="py-16 sm:py-24 lg:py-32 bg-gray-50 dark:bg-slate-950" id="services">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader 
                    index={t('services_title')}
                    title={t('services_headline')}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {services.map((item, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            className={`p-8 sm:p-10 rounded-2xl bg-white dark:bg-slate-950 border border-black/5 dark:border-slate-700/50 ${item.borderHover} transition-all group`}
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-200 dark:bg-zinc-800 flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-gray-900 dark:text-white text-2xl sm:text-3xl">{item.icon}</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">{item.title}</h3>
                            <p className="text-gray-600 dark:text-[#adaaaa] leading-relaxed text-sm sm:text-base">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;