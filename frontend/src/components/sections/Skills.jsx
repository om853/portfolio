import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

const categoryIcons = {
    Frontend: 'code',
    Backend: 'dns',
    Database: 'database',
    Tools: 'handyman',
    DevOps: 'cloud',
    Other: 'star'
};

const AnimatedBar = ({ level, color, delay }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });

    return (
        <div ref={ref} className="h-2 rounded-full bg-gray-200 dark:bg-white/5 overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${level}%` } : { width: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
                className={`h-full rounded-full ${color}`}
            />
        </div>
    );
};

const SkillCard = ({ skill, index, levelColor, progressColor }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.06 }}
            className="group relative p-5 rounded-2xl border border-gray-200 dark:border-slate-700/30 bg-white dark:bg-slate-900/50 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
            <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${levelColor}`}>
                        <span className="material-symbols-outlined text-white text-lg">{skill.icon || 'rocket_launch'}</span>
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{skill.name}</h3>
                        <p className="text-[0.55rem] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-bold">{skill.category}</p>
                    </div>
                </div>
                <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.06 + 0.3 }}
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-xs font-black shrink-0 ${levelColor}`}
                >
                    <span className="text-white">{skill.level}%</span>
                </motion.span>
            </div>
            <AnimatedBar level={skill.level} color={progressColor} delay={index * 0.06 + 0.15} />
            <div className="flex justify-between mt-1.5">
                <span className="text-[0.5rem] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">{skill.level}%</span>
            </div>
        </motion.div>
    );
};

const CategorySection = ({ category, skills }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });

    const categoryColor = {
        Frontend: { bg: 'bg-gray-900 dark:bg-white', text: 'text-gray-900 dark:text-white', badge: 'bg-gray-900/10 dark:bg-white/10 text-gray-900 dark:text-white border-gray-900/20 dark:border-white/20', bar: 'bg-gradient-to-r from-gray-700 dark:from-gray-300 to-gray-900 dark:to-white' },
        Backend: { bg: 'bg-gray-800 dark:bg-gray-200', text: 'text-gray-800 dark:text-gray-200', badge: 'bg-gray-800/10 dark:bg-gray-200/10 text-gray-800 dark:text-gray-200 border-gray-800/20 dark:border-gray-200/20', bar: 'bg-gradient-to-r from-gray-500 dark:from-gray-400 to-gray-800 dark:to-gray-200' },
        Database: { bg: 'bg-gray-700 dark:bg-gray-300', text: 'text-gray-700 dark:text-gray-300', badge: 'bg-gray-700/10 dark:bg-gray-300/10 text-gray-700 dark:text-gray-300 border-gray-700/20 dark:border-gray-300/20', bar: 'bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-400 dark:to-gray-300' },
        Tools: { bg: 'bg-gray-600 dark:bg-gray-400', text: 'text-gray-600 dark:text-gray-400', badge: 'bg-gray-600/10 dark:bg-gray-400/10 text-gray-600 dark:text-gray-400 border-gray-600/20 dark:border-gray-400/20', bar: 'bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-300 dark:to-gray-400' },
        DevOps: { bg: 'bg-gray-500 dark:bg-gray-500', text: 'text-gray-500', badge: 'bg-gray-500/10 text-gray-500 border-gray-500/20', bar: 'bg-gradient-to-r from-gray-400 to-gray-500' },
        Other: { bg: 'bg-gray-400 dark:bg-gray-400', text: 'text-gray-400', badge: 'bg-gray-400/10 text-gray-400 border-gray-400/20', bar: 'bg-gradient-to-r from-gray-300 to-gray-400' },
    };

    const colors = categoryColor[category] || categoryColor.Other;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 last:mb-0"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}>
                    <span className="material-symbols-outlined text-white dark:text-black text-xl">{categoryIcons[category] || 'star'}</span>
                </div>
                <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">{category}</h3>
                    <p className="text-[0.55rem] uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500 font-bold">{skills.length} skills</p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skills.map((skill, i) => (
                    <SkillCard
                        key={skill.id}
                        skill={skill}
                        index={i}
                        levelColor={colors.bg}
                        progressColor={colors.bar}
                    />
                ))}
            </div>
        </motion.div>
    );
};

const Skills = () => {
    const { t } = useLanguage();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef(null);
    const headerInView = useInView(sectionRef, { once: true, margin: '-80px' });

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await api.get('/skills/');
                setSkills(response.data);
            } catch (error) {
                console.error('Failed to fetch skills', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSkills();
    }, []);

    const grouped = skills.reduce((acc, skill) => {
        const cat = skill.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
    }, {});

    const categoryOrder = ['Frontend', 'Backend', 'Database', 'Tools', 'DevOps', 'Other'];
    const sortedCategories = Object.keys(grouped).sort(
        (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
    );

    return (
        <section className="py-24 sm:py-32 relative bg-white dark:bg-slate-950 overflow-hidden" id="skills" ref={sectionRef}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900/5 dark:from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-gray-900/3 dark:bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gray-900/3 dark:bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 sm:mb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-950/10 mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white" />
                        <span className="text-gray-900 dark:text-white font-bold tracking-widest text-[0.65rem] uppercase">{t('skills_title')}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-headline font-black text-gray-900 dark:text-white uppercase tracking-tighter"
                    >
                        {t('skills_headline')}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-gray-500 dark:text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mt-4"
                    >
                        {t('skills_sub')}
                    </motion.p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : skills.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-20">No skills yet</p>
                ) : (
                    <div className="max-w-5xl mx-auto">
                        {sortedCategories.map(category => (
                            <CategorySection key={category} category={category} skills={grouped[category]} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Skills;


