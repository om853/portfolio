import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import TiltCard from '../TiltCard';
import { useLanguage } from '../../context/LanguageContext';

const Projects = () => {
    const { t } = useLanguage();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects/');
                setProjects(response.data);
            } catch (error) {
                // silently fail
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) {
        return (
            <section className="py-24 sm:py-32 flex justify-center items-center min-h-[50vh]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-900/20 dark:border-white/20 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-900 dark:bg-white rounded-full animate-ping"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 sm:py-32 overflow-hidden bg-gray-50 dark:bg-slate-950 relative" id="work">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/5 dark:from-white/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 lg:mb-24 gap-6 sm:gap-8 text-left">
                    <div className="max-w-2xl">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-950/10 mb-6 shadow-sm"
                        >
                            <span className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white"></span>
                            <span className="text-gray-900 dark:text-white font-bold tracking-widest text-[0.65rem] uppercase">{t('projects_title')}</span>
                        </motion.div>
                        
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-7xl font-headline font-black text-gray-900 dark:text-white uppercase tracking-tighter"
                        >
                            {t('projects_headline')}
                        </motion.h2>
                    </div>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-400 max-w-sm text-sm sm:text-base leading-relaxed"
                    >
                        {t('projects_sub')}
                    </motion.p>
                </div>
                
                <div className="space-y-12 lg:space-y-32">
                    {projects.length > 0 ? (
                        projects.map((project, index) => {
                            const title = project.title;
                            const description = project.description;
                            const isEven = index % 2 === 0;
                            
                            return (
                                <motion.div 
                                    key={project.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
                                >
                                    {/* Project Image */}
                                    <TiltCard className="w-full lg:w-[60%] shrink-0">
                                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden group border border-gray-200 dark:border-slate-600/30 shadow-2xl">
                                            <div className="absolute inset-0 bg-gray-900/20 dark:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none mix-blend-overlay"></div>
                                            <img 
                                                src={project.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"} 
                                                alt={title} 
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            />
                                        </div>
                                    </TiltCard>

                                    {/* Project Details */}
                                    <div className="w-full lg:w-[40%] flex flex-col justify-center text-left">
                                        <div className="flex flex-wrap gap-2 mb-6 justify-start">
                                            {project.tech_stack && Array.isArray(project.tech_stack) && project.tech_stack.map((tech, idx) => (
                                                <span key={idx} className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 text-[0.65rem] font-bold uppercase tracking-widest border border-gray-200 dark:border-slate-700/50 shadow-sm">{tech}</span>
                                            ))}
                                        </div>
                                        
                                        <h3 className="text-3xl sm:text-4xl font-headline font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-tight group-hover:text-gradient transition-all">{title}</h3>
                                        
                                        <div className="space-y-4 mb-8">
                                            {/* Mocking Case Study structure since DB only has description */}
                                            <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700/50 shadow-sm">
                                                <h4 className="text-[0.65rem] text-gray-900 dark:text-white uppercase tracking-widest font-bold mb-2">Overview</h4>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description || "No description provided."}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-4 justify-start">
                                            {project.live_demo && (
                                                <a href={project.live_demo} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-gradient-to-r from-gray-900 dark:from-white to-gray-600 dark:to-gray-400 text-white dark:text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                                                    <span>{t('live_demo')}</span>
                                                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                                                </a>
                                            )}
                                            {project.github && (
                                                <a href={project.github} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700/50 text-gray-900 dark:text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-50 dark:hover:bg-slate-900/60 transition-all flex items-center gap-2 shadow-sm">
                                                    <span>{t('github')}</span>
                                                    <span className="material-symbols-outlined text-sm">code</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="w-full text-center py-24 bg-white dark:bg-slate-950 rounded-3xl border border-gray-200 dark:border-slate-700/20 text-gray-500 dark:text-gray-400 uppercase font-bold tracking-widest text-sm shadow-sm">
                            {t('no_projects')}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Projects;
