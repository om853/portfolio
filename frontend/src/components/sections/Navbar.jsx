import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [profile, setProfile] = useState(null);
    const { t } = useLanguage();

    useEffect(() => {
        api.get('/public-profile/').then(r => setProfile(r.data)).catch(() => {});
    }, []);

    const navLinks = [
        { name: t('nav_work'), href: '#work', key: 'work' },
        { name: t('nav_about'), href: '#about', key: 'about' },
        { name: t('nav_skills'), href: '#skills', key: 'skills' },
        { name: t('nav_certs'), href: '#certificates', key: 'certificates' },
        { name: t('nav_contact'), href: '#contact', key: 'contact' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
            const sections = ['work', 'about', 'skills', 'certificates', 'contact'];
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i]);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 150) {
                        setActiveSection(sections[i]);
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const handleNavClick = useCallback((e, href) => {
        e.preventDefault();
        setIsMenuOpen(false);
        const target = document.querySelector(href);
        if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }, []);

    return (
        <>
            <motion.nav 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-4 left-1/2 -translate-x-1/2 w-[min(95%,calc(100vw-1.5rem))] max-w-7xl rounded-2xl border flex justify-between items-center px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-4 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,15,15,0.08)] border-black/5' : 'bg-transparent border-transparent'}`}
            >
                <a href="#" onClick={(e) => handleNavClick(e, 'body')} className="flex items-center gap-2 sm:gap-3 select-none relative group shrink-0 min-w-0">
                    {profile?.hero_image ? (
                        <img src={profile.hero_image} alt="Omar" className="w-8 sm:w-9 h-8 sm:h-9 rounded-full object-cover border border-gray-900/20 shrink-0" />
                    ) : (
                        <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs sm:text-sm font-black text-gray-700 shrink-0">O</div>
                    )}
                    <span className="text-sm sm:text-base md:text-lg lg:text-xl font-headline font-black tracking-tighter text-gray-900 uppercase truncate">{profile?.name || 'OMAR'}</span>
                </a>

                <div className="hidden lg:flex items-center gap-1 xl:gap-2 glass px-2 xl:px-4 py-1 rounded-full mx-2 shrink min-w-0">
                    {navLinks.map((link) => (
                        <a 
                            key={link.key}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className={`relative px-2 xl:px-3 py-1.5 font-bold tracking-tight uppercase text-[0.6rem] xl:text-[0.7rem] transition-colors rounded-full whitespace-nowrap ${activeSection === link.key ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            {activeSection === link.key && (
                                <motion.div 
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-gray-100 rounded-full -z-10"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            {link.name}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleNavClick(e, '#contact')}
                        className="hidden sm:inline-flex bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-950 font-bold uppercase text-[0.6rem] md:text-[0.7rem] px-3 md:px-4 xl:px-5 py-1.5 md:py-2 rounded-full transition-all cursor-pointer shadow-md hover:shadow-lg shadow-slate-500/10 shrink-0"
                    >
                        {t('get_in_touch')}
                    </motion.button>

                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center rounded-full bg-white border border-black/5 shadow-md cursor-pointer shrink-0"
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    >
                        <div className="flex flex-col gap-1 w-4 sm:w-5">
                            <span className={`block h-[2px] bg-gray-900 transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-[6px]' : ''}`}></span>
                            <span className={`block h-[2px] bg-gray-900 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block h-[2px] bg-gray-900 transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`}></span>
                        </div>
                    </button>
                </div>
            </motion.nav>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
                        animate={{ opacity: 1, clipPath: 'circle(150% at top right)' }}
                        exit={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-60 flex flex-col items-center justify-center bg-white/95 backdrop-blur-2xl lg:hidden"
                    >
                        <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
                            <div className="text-xl sm:text-2xl font-headline font-black text-gray-900 uppercase">OMAR</div>
                        </div>
                        
                        <nav className="space-y-5 sm:space-y-6 md:space-y-7 text-center flex flex-col w-full px-6 sm:px-8 max-w-md">
                            {navLinks.map((link, index) => (
                                <motion.a
                                    key={link.key}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + (index * 0.08), ease: [0.16, 1, 0.3, 1] }}
                                    className="block text-3xl sm:text-4xl font-headline font-black tracking-tighter text-gray-900 uppercase hover:text-gray-500 transition-colors py-1.5 sm:py-2 border-b border-black/5"
                                >
                                    {link.name}
                                </motion.a>
                            ))}
                            <motion.button 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                onClick={(e) => handleNavClick(e, '#contact')}
                                className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-950 font-black uppercase text-sm px-5 py-3.5 sm:py-4 rounded-xl shadow-xl"
                            >
                                {t('get_in_touch')}
                            </motion.button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;