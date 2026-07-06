import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const ExperiencesPage = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingExperience, setEditingExperience] = useState(null);
    const [formData, setFormData] = useState({
        company: '', position: '', position_ar: '', description: '', description_ar: '',
        start_date: '', end_date: '', order: 0,
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { fetchExperiences(); }, []);

    const fetchExperiences = async () => {
        setLoading(true);
        try {
            const response = await api.get('/experiences/');
            setExperiences(response.data);
        } catch (error) {
            console.error('Failed to fetch experiences');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openModal = (experience = null) => {
        if (experience) {
            setEditingExperience(experience);
            setFormData({
                company: experience.company,
                position: experience.position,
                position_ar: experience.position_ar || '',
                description: experience.description,
                description_ar: experience.description_ar || '',
                start_date: experience.start_date,
                end_date: experience.end_date || '',
                order: experience.order,
            });
        } else {
            setEditingExperience(null);
            setFormData({ company: '', position: '', position_ar: '', description: '', description_ar: '', start_date: '', end_date: '', order: 0 });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingExperience) {
                await api.put(`/experiences/${editingExperience.id}/`, formData);
            } else {
                await api.post('/experiences/', formData);
            }
            setShowModal(false);
            fetchExperiences();
        } catch (error) {
            alert(editingExperience ? 'Failed to update experience' : 'Failed to create experience');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this experience?')) return;
        try {
            await api.delete(`/experiences/${id}/`);
            fetchExperiences();
        } catch (error) {
            alert('Failed to delete experience');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white light-text">Manage Experiences</h2>
                    <p className="text-[#adaaaa] light-muted text-xs">A total of {experiences.length} experiences in your portfolio.</p>
                </div>
                <button onClick={() => openModal()} className="px-6 py-3 bg-white text-gray-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform cursor-pointer">
                    + NEW EXPERIENCE
                </button>
            </div>

            <div className="bg-[#1a1919] light-card border border-white/5 light-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                            <tr className="border-b border-white/5 light-border text-[0.65rem] text-[#adaaaa] light-muted uppercase tracking-widest font-black">
                                <th className="px-6 py-5">Company</th>
                                <th className="px-4 py-5">Position</th>
                                <th className="px-4 py-5">Start Date</th>
                                <th className="px-4 py-5">End Date</th>
                                <th className="px-4 py-5">Order</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 light-border">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-20 text-center"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                            ) : experiences.length > 0 ? (
                                experiences.map((exp) => (
                                    <tr key={exp.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-[#2c2c2c] border border-white/10 light-border flex items-center justify-center text-white font-black text-sm shrink-0">
                                                    {exp.company.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white light-text text-sm">{exp.company}</p>
                                                    <p className="text-[0.6rem] text-[#adaaaa] light-muted uppercase tracking-tighter">ID: {exp.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-white light-text text-sm font-bold">{exp.position}</span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-[#adaaaa] light-muted text-xs">{exp.start_date}</span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-[#adaaaa] light-muted text-xs">{exp.end_date || 'Present'}</span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-white text-xs font-bold">{exp.order}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openModal(exp)} className="p-2 text-[#adaaaa] hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer">
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete(exp.id)} className="p-2 text-[#adaaaa] hover:text-[#ff6e84] hover:bg-[#ff6e84]/5 rounded-lg transition-all cursor-pointer">
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-[#adaaaa] light-muted text-sm font-bold uppercase tracking-widest">No experiences found. Create your first experience.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#1a1919] light-card border border-white/10 light-border rounded-2xl p-6 sm:p-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white light-text">{editingExperience ? 'Edit Experience' : 'New Experience'}</h3>
                                <button onClick={() => setShowModal(false)} className="text-[#adaaaa] hover:text-white cursor-pointer">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Company</label>
                                    <input required name="company" value={formData.company} onChange={handleChange} placeholder="Tech Corp" className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Position (EN)</label>
                                    <input required name="position" value={formData.position} onChange={handleChange} placeholder="Full Stack Developer" className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Position (AR)</label>
                                    <input name="position_ar" value={formData.position_ar} onChange={handleChange} placeholder="مطور ويب متكامل" className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Description (EN)</label>
                                    <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Describe your role and achievements..." className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white resize-none" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Description (AR)</label>
                                    <textarea name="description_ar" value={formData.description_ar} onChange={handleChange} rows="3" placeholder="وصف دورك وإنجازاتك..." className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white resize-none" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Start Date</label>
                                        <input type="date" required name="start_date" value={formData.start_date} onChange={handleChange} className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">End Date</label>
                                        <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Order</label>
                                    <input type="number" name="order" value={formData.order} onChange={handleChange} min="0" className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-white/10 light-border text-white light-text font-bold text-xs rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={submitting} className="flex-1 py-3 bg-white text-gray-900 font-bold text-xs rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 cursor-pointer">
                                        {submitting ? 'Saving...' : editingExperience ? 'Update Experience' : 'Create Experience'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExperiencesPage;
