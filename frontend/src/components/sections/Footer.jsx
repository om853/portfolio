import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="w-full bg-white dark:bg-slate-950 pt-24 pb-12 overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 lg:mb-24">
                    <div className="flex flex-col items-start text-left">
                        <div className="text-4xl sm:text-5xl font-headline font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4 group cursor-pointer">
                            OMAR
                            <span className="text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity">.</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs leading-relaxed">
                            Building full-stack digital experiences with passion and precision.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-12 sm:gap-24 md:justify-end">
                        <div className="flex flex-col space-y-4 items-start">
                            <h4 className="text-gray-900 dark:text-white text-[0.65rem] font-bold uppercase tracking-widest mb-2">Connect</h4>
                            <a href="https://github.com/om853" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-bold transition-colors">GitHub</a>
                            <a href="https://www.linkedin.com/in/omar-mohamed-406143374" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-bold transition-colors">LinkedIn</a>
                            <a href="https://wa.me/201507044651" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-bold transition-colors">WhatsApp</a>
                        </div>
                        
                        <div className="flex flex-col space-y-4 items-start">
                            <h4 className="text-gray-900 dark:text-white text-[0.65rem] font-bold uppercase tracking-widest mb-2">Explore</h4>
                            <a href="#work" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-bold transition-colors">{t('nav_work')}</a>
                            <a href="#about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-bold transition-colors">{t('nav_about')}</a>
                            <a href="#skills" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-bold transition-colors">{t('nav_skills')}</a>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-200 dark:border-slate-700/20">
                    <p className="text-[0.65rem] tracking-widest uppercase text-gray-400 dark:text-gray-500 font-bold">
                        &copy; {new Date().getFullYear()} Omar Mohamed. {t('footer_all_rights')}
                    </p>
                    
                    <p className="text-[0.65rem] tracking-widest uppercase text-gray-400 dark:text-gray-500 font-bold">
                        Designed & Developed by <span className="text-gray-900 dark:text-white">Omar</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;