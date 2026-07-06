import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from '../MagneticButton';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

const Contact = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ 
        name: '', email: '', phone: '', company: '', budget: '', timeline: '', message: '', hp: '' 
    });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.hp) return;

        if (!formData.name.trim() || formData.name.trim().length < 2) {
            setStatus({ type: 'error', msg: 'Please enter your name (at least 2 characters).' });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setStatus({ type: 'error', msg: 'Please enter a valid email address.' });
            return;
        }
        if (!formData.message.trim() || formData.message.trim().length < 10) {
            setStatus({ type: 'error', msg: 'Message must be at least 10 characters long.' });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: '', msg: '' });

        try {
            await api.post('/messages/', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: `Company: ${formData.company}\nBudget: ${formData.budget}\nTimeline: ${formData.timeline}\n\n${formData.message}`,
            });
            setStatus({ type: 'success', msg: t('msg_success') });
            setFormData({ name: '', email: '', phone: '', company: '', budget: '', timeline: '', message: '', hp: '' });
        } catch (error) {
            setStatus({ type: 'error', msg: t('msg_error') });
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full bg-white dark:bg-slate-950 border-b border-gray-300 dark:border-slate-700/50 focus:border-gray-900 dark:focus:border-white text-gray-900 dark:text-white rounded-none py-4 px-2 transition-all outline-none placeholder-gray-400 dark:placeholder-gray-600 text-sm sm:text-base";
    const labelClass = "text-[0.65rem] uppercase tracking-widest text-gray-900 dark:text-white font-bold absolute -top-4 left-2";

    return (
        <section className="py-24 sm:py-32 bg-white dark:bg-slate-950 relative overflow-hidden" id="contact">
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-gray-200/10 dark:bg-slate-950/30 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    
                    <div className="space-y-8 text-left">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-950/10 shadow-sm"
                        >
                            <span className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white"></span>
                            <span className="text-gray-900 dark:text-white font-bold tracking-widest text-[0.65rem] uppercase">{t('contact_title')}</span>
                        </motion.div>
                        
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-7xl font-headline font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight"
                        >
                            {t('contact_headline')}
                        </motion.h2>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-600 dark:text-gray-400 max-w-sm text-lg leading-relaxed"
                        >
                            {t('contact_sub')}
                        </motion.p>

                        <div className="pt-12 space-y-6">
                            {[
                                { icon: 'mail', label: 'Email', value: 'mrmhmdalshhatly@gmail.com', href: 'mailto:mrmhmdalshhatly@gmail.com' },
                                { icon: 'call', label: 'Phone', value: '+20 150 704 4651', href: 'tel:+201507044651' }
                            ].map((item, idx) => (
                                <motion.a 
                                    key={idx}
                                    href={item.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + (idx * 0.1) }}
                                    className="flex items-center gap-6 group w-max"
                                >
                                    <div className="w-14 h-14 rounded-full border border-gray-200 dark:border-slate-700/50 flex items-center justify-center group-hover:border-gray-900 dark:group-hover:border-slate-400 group-hover:bg-gray-900/5 dark:group-hover:bg-slate-950/20 transition-all">
                                        <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{item.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-[0.65rem] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-1">{item.label}</p>
                                        <p className="text-gray-900 dark:text-white font-bold text-lg group-hover:text-gray-900 dark:group-hover:text-white transition-colors" dir="ltr">{item.value}</p>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-white dark:bg-slate-950 p-8 sm:p-12 rounded-3xl border border-gray-200 dark:border-slate-700/50 shadow-2xl relative"
                    >
                        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                            <input type="text" name="hp" value={formData.hp} onChange={handleChange} className="hidden" tabIndex={-1} autoComplete="off" />
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <div className="relative group">
                                    <label htmlFor="name" className={`${labelClass} ${formData.name ? 'opacity-100' : 'opacity-0 group-focus-within:opacity-100'} transition-opacity`}>{t('your_name')}</label>
                                    <input id="name" required name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder={t('placeholder_name')} type="text" />
                                </div>
                                <div className="relative group">
                                    <label htmlFor="email" className={`${labelClass} ${formData.email ? 'opacity-100' : 'opacity-0 group-focus-within:opacity-100'} transition-opacity`}>{t('email_address')}</label>
                                    <input id="email" required name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder={t('placeholder_email')} type="email" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <div className="relative group">
                                    <label htmlFor="company" className={`${labelClass} ${formData.company ? 'opacity-100' : 'opacity-0 group-focus-within:opacity-100'} transition-opacity`}>Company (Optional)</label>
                                    <input id="company" name="company" value={formData.company} onChange={handleChange} className={inputClass} placeholder="Your Company" type="text" />
                                </div>
                                <div className="relative group">
                                    <label htmlFor="phone" className={`${labelClass} ${formData.phone ? 'opacity-100' : 'opacity-0 group-focus-within:opacity-100'} transition-opacity`}>Phone (Optional)</label>
                                    <input id="phone" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+20 1xx xxx xxxx" type="tel" dir="ltr" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <div className="relative group">
                                    <label htmlFor="budget" className={`${labelClass} ${formData.budget ? 'opacity-100' : 'opacity-0 group-focus-within:opacity-100'} transition-opacity`}>Project Budget</label>
                                    <select id="budget" name="budget" value={formData.budget} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer bg-transparent`}>
                                        <option value="" disabled className="text-gray-400 bg-white dark:bg-slate-950">Select budget range...</option>
                                        <option value="< $1k" className="bg-white dark:bg-slate-950 text-gray-900 dark:text-white">&lt; $1,000</option>
                                        <option value="$1k - $5k" className="bg-white dark:bg-slate-950 text-gray-900 dark:text-white">$1,000 - $5,000</option>
                                        <option value="$5k - $10k" className="bg-white dark:bg-slate-950 text-gray-900 dark:text-white">$5,000 - $10,000</option>
                                        <option value="$10k+" className="bg-white dark:bg-slate-950 text-gray-900 dark:text-white">$10,000+</option>
                                    </select>
                                </div>
                                <div className="relative group">
                                    <label htmlFor="timeline" className={`${labelClass} ${formData.timeline ? 'opacity-100' : 'opacity-0 group-focus-within:opacity-100'} transition-opacity`}>Timeline</label>
                                    <select id="timeline" name="timeline" value={formData.timeline} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer bg-transparent`}>
                                        <option value="" disabled className="text-gray-400 bg-white dark:bg-slate-950">When to start?</option>
                                        <option value="Immediately" className="bg-white dark:bg-slate-950 text-gray-900 dark:text-white">Immediately</option>
                                        <option value="1-3 Months" className="bg-white dark:bg-slate-950 text-gray-900 dark:text-white">1-3 Months</option>
                                        <option value="3-6 Months" className="bg-white dark:bg-slate-950 text-gray-900 dark:text-white">3-6 Months</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="relative group pt-4">
                                <label htmlFor="message" className={`${labelClass} ${formData.message ? 'opacity-100' : 'opacity-0 group-focus-within:opacity-100'} transition-opacity -top-2`}>{t('project_overview')}</label>
                                <textarea id="message" required name="message" value={formData.message} onChange={handleChange} className={`${inputClass} resize-none min-h-[120px]`} placeholder={t('placeholder_message')} rows="4"></textarea>
                            </div>
                            
                            <div className="pt-4">
                                <AnimatePresence>
                                    {status.msg && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0, y: -10 }}
                                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                                            exit={{ opacity: 0, height: 0, y: -10 }}
                                            className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-600 dark:text-[#ff6e84] border border-red-500/20'}`}
                                        >
                                            <span className="material-symbols-outlined">{status.type === 'success' ? 'check_circle' : 'error'}</span>
                                            {status.msg}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                                <MagneticButton className="w-full cursor-pointer">
                                    <motion.button 
                                        whileTap={{ scale: 0.98 }}
                                        disabled={isSubmitting}
                                        className="w-full py-5 bg-gradient-to-r from-gray-900 dark:from-gray-200 to-gray-600 dark:to-gray-400 text-white dark:text-black font-black uppercase tracking-widest rounded-xl hover:shadow-xl transition-all disabled:opacity-50 text-sm sm:text-base flex items-center justify-center gap-3" 
                                        type="submit"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                                {t('sending')}
                                            </>
                                        ) : (
                                            <>
                                                {t('send_message')}
                                                <span className="material-symbols-outlined">arrow_forward</span>
                                            </>
                                        )}
                                    </motion.button>
                                </MagneticButton>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;