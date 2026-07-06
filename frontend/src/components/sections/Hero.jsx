import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import MagneticButton from '../MagneticButton';
import TiltCard from '../TiltCard';
import MeshGradient from '../ui/MeshGradient';
import Particles from '../ui/Particles';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const Hero = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const titleAnimation = useAnimation();
    const subtitleAnimation = useAnimation();
    const buttonsAnimation = useAnimation();
    const imageAnimation = useAnimation();
    
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

    const roleTexts = ["Full Stack", "Frontend", "Backend"];

    const maxLength = Math.max(...roleTexts.map(t => t.length));
    const [textIndex, setTextIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const current = roleTexts[textIndex];
        let timeout;

        if (isPaused) {
            timeout = setTimeout(() => {
                setIsPaused(false);
                setIsDeleting(true);
            }, 1800);
            return () => clearTimeout(timeout);
        }

        if (!isDeleting) {
            if (displayText.length < current.length) {
                timeout = setTimeout(() => {
                    setDisplayText(current.substring(0, displayText.length + 1));
                }, 80);
            } else {
                setIsPaused(true);
            }
        } else {
            if (displayText.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayText(current.substring(0, displayText.length - 1));
                }, 40);
            } else {
                setIsDeleting(false);
                setTextIndex((prev) => (prev + 1) % roleTexts.length);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, textIndex, isPaused, roleTexts]);

    useEffect(() => {
        titleAnimation.start({ opacity: [0, 1], y: [40, 0], transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } });
        subtitleAnimation.start({ opacity: [0, 1], y: [20, 0], transition: { duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] } });
        buttonsAnimation.start({ opacity: [0, 1], y: [20, 0], transition: { duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] } });
        imageAnimation.start({ opacity: [0, 1], scale: [0.9, 1], transition: { duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] } });
    }, []);

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 overflow-hidden bg-transparent">
            {/* Premium Background Elements */}
            <MeshGradient />
            <Particles />
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50/90 dark:to-[#050505]/90 pointer-events-none z-0" />
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full min-h-[80vh]">
                <motion.div 
                    style={{ y: y1 }}
                    className="lg:col-span-7 space-y-6 lg:space-y-8 text-left"
                >
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass text-gray-900 dark:text-white text-[0.7rem] sm:text-xs font-bold tracking-widest uppercase shadow-sm"
                    >
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white dark:bg-zinc-800 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white dark:bg-zinc-800"></span>
                        </span>
                        {t('hero_available')}
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 40 }}
                        animate={titleAnimation}
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-headline font-black tracking-tighter leading-[1.05] text-gray-900 dark:text-white"
                    >
                        {t('hero_hi')} <br />
                        <span
                            className="text-gradient drop-shadow-sm inline-block"
                            style={{ minWidth: `${maxLength}ch` }}
                        >
                            {displayText}
                            <span className="animate-pulse text-white dark:text-zinc-400 font-light">|</span>
                        </span>
                        <br />
                        <span className="text-gray-900 dark:text-white">Developer</span>
                    </motion.h1>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={subtitleAnimation}
                        className="text-gray-600 dark:text-gray-400 text-base sm:text-lg md:text-xl max-w-xl font-body leading-relaxed"
                    >
                        {t('hero_sub')}
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={buttonsAnimation}
                        className="flex flex-col sm:flex-row gap-4 pt-6"
                    >
                        <MagneticButton className="px-8 py-4 bg-slate-950 text-white rounded-xl font-bold tracking-tight shadow-lg shadow-slate-950/15 hover:shadow-xl transition-shadow text-center cursor-pointer border border-slate-800/80 dark:bg-slate-200 dark:text-slate-950 dark:border-slate-300/30 dark:hover:bg-slate-100">
                            <a href="#work">{t('view_work')}</a>
                        </MagneticButton>
                        <MagneticButton className="px-8 py-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-600/40 rounded-xl font-bold tracking-tight hover:bg-gray-50 dark:hover:bg-slate-900 transition-all text-center cursor-pointer text-gray-900 dark:text-white shadow-sm hover:shadow-md">
                            <a href="#contact">{t('get_in_touch')}</a>
                        </MagneticButton>
                    </motion.div>
                </motion.div>
                
                <motion.div 
                    style={{ y: y2 }}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={imageAnimation}
                    className="lg:col-span-5 relative flex justify-center lg:justify-end mt-12 lg:mt-0"
                >
                    <TiltCard className="relative w-full max-w-sm aspect-[4/5] sm:aspect-square md:aspect-[3/4] rounded-2xl overflow-hidden border border-black/10 dark:border-slate-700/50 group shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(15,23,42,0.35)]">
                                <motion.img 
                                    src={user?.hero_image || "/myImage.png"} 
                                    alt="Omar Mohamed - Frontend Developer" 
                                    className="w-full h-full object-cover transition-all duration-1000 scale-110 group-hover:scale-100" 
                                />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 opacity-80 group-hover:opacity-60" />
                        
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="absolute bottom-6 left-6 p-4 glass rounded-xl border border-white/10 shadow-lg text-left backdrop-blur-md"
                        >
                            <p className="text-[0.65rem] text-gray-600 dark:text-gray-300 uppercase tracking-widest mb-1.5 font-bold">{t('hero_focus_title')}</p>
                            <p className="text-sm font-bold text-white">{t('hero_focus_value')}</p>
                        </motion.div>
                    </TiltCard>

                    <motion.div
                        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-6 -right-6 sm:top-4 sm:-right-8 w-24 h-24 rounded-2xl glass border border-white/20 flex items-center justify-center shadow-xl z-20"
                    >
                        <div className="text-center">
                            <p className="text-3xl font-black text-gradient drop-shadow-sm">2+</p>
                            <p className="text-[0.55rem] text-gray-700 dark:text-gray-300 uppercase tracking-widest font-bold mt-1">{t('hero_years')}</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;