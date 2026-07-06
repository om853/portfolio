import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

const formatDateRange = (start, end) => {
    const s = formatDate(start);
    const e = end ? formatDate(end) : 'Present';
    return `${s} — ${e}`;
};

const ExperienceItem = ({ year, role, company, description, index }) => {
    const isEven = index % 2 === 0;

    return (
        <div className="relative flex w-full mb-12 sm:mb-16 md:mb-24">
            
            {/* Timeline dot - offset from edge on mobile, centered on md+ */}
            <div className="absolute top-0 z-10 left-4 sm:left-8 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-gray-900 group-hover:scale-150 group-hover:bg-gray-900 transition-all duration-300 shadow-lg" />
            
            {/* Spacer — takes space on mobile, half on md+; order swap on alternating items */}
            <div className={`w-10 sm:w-16 md:w-1/2 shrink-0 ${isEven ? '' : 'md:order-1'}`} />

            {/* Content box */}
            <motion.div 
                initial={{ opacity: 0, x: 30, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`
                    w-[calc(100%-3rem)] sm:w-[calc(100%-5rem)] md:w-[calc(50%-2.5rem)] lg:w-[calc(50%-3rem)]
                    p-5 sm:p-6 lg:p-8
                    rounded-2xl glass hover:shadow-xl hover:-translate-y-0.5 md:hover:-translate-y-1
                    transition-all duration-300 border border-black/5
                    text-left
                    ${isEven ? '' : 'md:order-0'}
                `}
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-headline font-black text-gray-900 uppercase tracking-tight">{role}</h3>
                    <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-gray-900/10 to-gray-600/10 border border-gray-900/20 text-gray-900 text-[0.6rem] sm:text-xs font-bold tracking-widest uppercase shrink-0 self-start sm:self-auto">
                        {year}
                    </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-4">{company}</h4>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {description}
                </p>
            </motion.div>
            
        </div>
    );
};

const Experience = () => {
    const { t } = useLanguage();
    const containerRef = useRef(null);
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });
    
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await api.get('/experiences/');
                setExperiences(response.data);
            } catch (err) {
                console.error('Failed to load experiences', err);
            } finally {
                setLoading(false);
            }
        };
        fetchExperiences();
    }, []);

    return (
        <section className="py-24 sm:py-32 bg-white relative overflow-hidden" id="experience">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="mb-16 sm:mb-24 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 mb-6">
                        <span className="w-2 h-2 rounded-full bg-gray-900"></span>
                        <span className="text-gray-900 font-bold tracking-widest text-[0.65rem] uppercase">Career Path</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-headline font-black text-gray-900 uppercase tracking-tighter"
                    >
                        Experience
                    </motion.h2>
                </div>

                <div className="relative max-w-5xl mx-auto" ref={containerRef}>
                    {/* Background Line — offset from edge on mobile, centered on md+ */}
                    <div className="absolute top-0 bottom-0 left-4 sm:left-8 md:left-1/2 md:-translate-x-1/2 w-0.5 md:w-1 bg-gray-200 rounded-full"></div>
                    
                    {/* Animated Progress Line */}
                    <motion.div 
                        style={{ scaleY, transformOrigin: "top" }}
                        className="absolute top-0 bottom-0 left-4 sm:left-8 md:left-1/2 md:-translate-x-1/2 w-0.5 md:w-1 bg-gradient-to-b from-gray-900 to-gray-600 rounded-full z-0"
                    ></motion.div>

                    {/* Experience Items */}
                    <div className="relative z-10 pt-10">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : experiences.length === 0 ? (
                            <p className="text-center text-gray-500 py-20">No experiences yet</p>
                        ) : (
                            experiences.map((exp, index) => (
                                <ExperienceItem 
                                    key={exp.id || index}
                                    index={index}
                                    year={formatDateRange(exp.start_date, exp.end_date)}
                                    role={exp.position}
                                    company={exp.company}
                                    description={exp.description}
                                />
                            ))
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Experience;