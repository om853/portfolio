import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const SkillsPage = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [formData, setFormData] = useState({ name: '', category: 'Frontend', level: 50 });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { fetchSkills(); }, []);

    const fetchSkills = async () => {
        setLoading(true);
        try {
            const response = await api.get('/skills/');
            setSkills(response.data);
        } catch (error) {
            console.error('Failed to fetch skills');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openModal = (skill = null) => {
        if (skill) {
            setEditingSkill(skill);
            setFormData({ name: skill.name, category: skill.category, level: skill.level });
        } else {
            setEditingSkill(null);
            setFormData({ name: '', category: 'Frontend', level: 50 });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingSkill) {
                await api.put(`/skills/${editingSkill.id}/`, formData);
            } else {
                await api.post('/skills/', formData);
            }
            setShowModal(false);
            fetchSkills();
        } catch (error) {
            alert(editingSkill ? 'Failed to update skill' : 'Failed to create skill');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this skill?')) return;
        try {
            await api.delete(`/skills/${id}/`);
            fetchSkills();
        } catch (error) {
            alert('Failed to delete skill');
        }
    };

    const categories = ['Frontend', 'Backend', 'Tools', 'Database', 'DevOps', 'Other'];

    const getCategoryBadge = (cat) => {
        const colors = {
            Frontend: 'bg-gray-400/10 text-gray-400 border-gray-400/20',
            Backend: 'bg-white/10 text-white border-white/20',
            Tools: 'bg-white/10 text-white border-white/20',
            Database: 'bg-[#ff6e84]/10 text-[#ff6e84] border-[#ff6e84]/20',
            DevOps: 'bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/20',
            Other: 'bg-white/10 text-white border-white/20'
        };
        return colors[cat] || colors.Other;
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white light-text">Manage Skills</h2>
                    <p className="text-[#adaaaa] light-muted text-xs">A total of {skills.length} skills in your portfolio.</p>
                </div>
                <button onClick={() => openModal()} className="px-6 py-3 bg-white text-gray-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform cursor-pointer">
                    + NEW SKILL
                </button>
            </div>

            <div className="bg-[#1a1919] light-card border border-white/5 light-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                            <tr className="border-b border-white/5 light-border text-[0.65rem] text-[#adaaaa] light-muted uppercase tracking-widest font-black">
                                <th className="px-6 py-5">Skill</th>
                                <th className="px-4 py-5">Category</th>
                                <th className="px-4 py-5">Level</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 light-border">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-20 text-center"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                            ) : skills.length > 0 ? (
                                skills.map((skill) => (
                                    <tr key={skill.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-[#2c2c2c] border border-white/10 light-border flex items-center justify-center text-white font-black text-sm shrink-0">
                                                    {skill.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white light-text text-sm">{skill.name}</p>
                                                    <p className="text-[0.6rem] text-[#adaaaa] light-muted uppercase tracking-tighter">ID: {skill.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className={`px-2 py-1 rounded-md text-[0.55rem] font-black uppercase tracking-widest border ${getCategoryBadge(skill.category)}`}>
                                                {skill.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 h-2 bg-white/5 light-section rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-gray-400 to-gray-600 rounded-full" style={{ width: `${skill.level}%` }} />
                                                </div>
                                                <span className="text-white text-xs font-bold">{skill.level}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openModal(skill)} className="p-2 text-[#adaaaa] hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer">
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete(skill.id)} className="p-2 text-[#adaaaa] hover:text-[#ff6e84] hover:bg-[#ff6e84]/5 rounded-lg transition-all cursor-pointer">
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="px-6 py-12 text-center text-[#adaaaa] light-muted text-sm font-bold uppercase tracking-widest">No skills found. Create your first skill.</td></tr>
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
                                <h3 className="text-lg font-bold text-white light-text">{editingSkill ? 'Edit Skill' : 'New Skill'}</h3>
                                <button onClick={() => setShowModal(false)} className="text-[#adaaaa] hover:text-white cursor-pointer">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Skill Name</label>
                                    <input required name="name" value={formData.name} onChange={handleChange} placeholder="React.js" className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white cursor-pointer">
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Skill Level: {formData.level}%</label>
                                    <input type="range" name="level" value={formData.level} onChange={handleChange} min="0" max="100" className="w-full accent-white" />
                                    <div className="flex justify-between text-[0.5rem] text-[#adaaaa] light-muted uppercase tracking-widest font-bold">
                                        <span>Beginner</span>
                                        <span>Intermediate</span>
                                        <span>Expert</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-white/10 light-border text-white light-text font-bold text-xs rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={submitting} className="flex-1 py-3 bg-white text-gray-900 font-bold text-xs rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 cursor-pointer">
                                        {submitting ? 'Saving...' : editingSkill ? 'Update Skill' : 'Create Skill'}
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

export default SkillsPage;
