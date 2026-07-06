import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../SectionHeader';
import { useLanguage } from '../../context/LanguageContext';

const Certificates = () => {
    const { t } = useLanguage();

    const certificates = [
        {
            title: 'Certificate Title',
            issuer: 'Issuing Organization',
            date: '2024',
            icon: 'school',
            color: '#000000'
        }
    ];

    return (
        <section className="py-16 sm:py-24 lg:py-32 bg-white dark:bg-slate-950" id="certificates">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader 
                    index={t('certs_title')}
                    title={t('certs_headline')}
                    subtitle={t('certs_sub')}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {certificates.map((cert, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="p-6 sm:p-8 rounded-2xl bg-gray-100 dark:bg-slate-950 border border-gray-200 dark:border-slate-700/50 group hover:border-gray-900/20 dark:hover:border-slate-500/30 transition-all"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gray-900/5 dark:bg-slate-950/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-gray-900 dark:text-white text-2xl">{cert.icon}</span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">{cert.title}</h3>
                            <p className="text-gray-600 dark:text-[#adaaaa] text-sm mb-1">{cert.issuer}</p>
                            <p className="text-[0.65rem] text-gray-900 dark:text-white font-bold uppercase tracking-widest">{cert.date}</p>
                        </motion.div>
                    ))}

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: certificates.length * 0.1 }}
                        viewport={{ once: true }}
                        className="p-6 sm:p-8 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-dashed border-black/10 dark:border-slate-700/50 flex flex-col items-center justify-center text-center min-h-[200px] hover:border-gray-900/20 dark:hover:border-slate-500/30 transition-all"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-[#adaaaa] text-2xl">add</span>
                        </div>
                        <p className="text-[#adaaaa] text-sm font-bold">More certificates coming soon</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Certificates;