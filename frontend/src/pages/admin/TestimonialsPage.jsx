import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const TestimonialsPage = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [formData, setFormData] = useState({ name: '', position: '', message: '', avatar: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { fetchTestimonials(); }, []);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const response = await api.get('/testimonials/');
            setTestimonials(response.data);
        } catch (error) {
            console.error('Failed to fetch testimonials');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openModal = (testimonial = null) => {
        if (testimonial) {
            setEditingTestimonial(testimonial);
            setFormData({
                name: testimonial.name,
                position: testimonial.position || '',
                message: testimonial.message,
                avatar: testimonial.avatar || ''
            });
        } else {
            setEditingTestimonial(null);
            setFormData({ name: '', position: '', message: '', avatar: '' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingTestimonial) {
                await api.put(`/testimonials/${editingTestimonial.id}/`, formData);
            } else {
                await api.post('/testimonials/', formData);
            }
            setShowModal(false);
            fetchTestimonials();
        } catch (error) {
            alert(editingTestimonial ? 'Failed to update testimonial' : 'Failed to create testimonial');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
        try {
            await api.delete(`/testimonials/${id}/`);
            fetchTestimonials();
        } catch (error) {
            alert('Failed to delete testimonial');
        }
    };

    const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    }) : '-';

    const truncate = (str, len = 80) => str && str.length > len ? str.substring(0, len) + '...' : str;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white light-text">Manage Testimonials</h2>
                    <p className="text-[#adaaaa] light-muted text-xs">A total of {testimonials.length} testimonials in your portfolio.</p>
                </div>
                <button onClick={() => openModal()} className="px-6 py-3 bg-white text-gray-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform cursor-pointer">
                    + NEW TESTIMONIAL
                </button>
            </div>

            <div className="bg-[#1a1919] light-card border border-white/5 light-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[640px]">
                        <thead>
                            <tr className="border-b border-white/5 light-border text-[0.65rem] text-[#adaaaa] light-muted uppercase tracking-widest font-black">
                                <th className="px-6 py-5">Name</th>
                                <th className="px-4 py-5">Position</th>
                                <th className="px-4 py-5">Message</th>
                                <th className="px-4 py-5">Avatar</th>
                                <th className="px-4 py-5">Created</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 light-border">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-20 text-center"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                            ) : testimonials.length > 0 ? (
                                testimonials.map((testimonial) => (
                                    <tr key={testimonial.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#2c2c2c] light-input border border-white/10 light-border overflow-hidden shrink-0">
                                                    {testimonial.avatar ? (
                                                        <img src={testimonial.avatar} className="w-full h-full object-cover" alt={testimonial.name} />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-white font-black text-sm">
                                                            {testimonial.name?.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white light-text text-sm">{testimonial.name}</p>
                                                    <p className="text-[0.6rem] text-[#adaaaa] light-muted uppercase tracking-tighter">ID: {testimonial.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-sm text-white light-text">{testimonial.position || '-'}</span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <p className="text-xs text-[#adaaaa] light-muted max-w-xs">{truncate(testimonial.message)}</p>
                                        </td>
                                        <td className="px-4 py-5">
                                            {testimonial.avatar ? (
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm text-green-400">check_circle</span>
                                                    <span className="text-[0.55rem] text-green-400 font-bold uppercase">Uploaded</span>
                                                </div>
                                            ) : (
                                                <span className="text-[0.55rem] text-[#adaaaa] font-bold uppercase">None</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-xs text-[#adaaaa] light-muted">{formatDate(testimonial.created_at)}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openModal(testimonial)} className="p-2 text-[#adaaaa] hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer">
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete(testimonial.id)} className="p-2 text-[#adaaaa] hover:text-[#ff6e84] hover:bg-[#ff6e84]/5 rounded-lg transition-all cursor-pointer">
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-[#adaaaa] light-muted text-sm font-bold uppercase tracking-widest">No testimonials found. Create your first testimonial.</td></tr>
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
                                <h3 className="text-lg font-bold text-white light-text">{editingTestimonial ? 'Edit Testimonial' : 'New Testimonial'}</h3>
                                <button onClick={() => setShowModal(false)} className="text-[#adaaaa] hover:text-white cursor-pointer">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Name</label>
                                        <input required name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Position</label>
                                        <input name="position" value={formData.position} onChange={handleChange} placeholder="CEO at Company" className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Message</label>
                                    <textarea required name="message" value={formData.message} onChange={handleChange} placeholder="Amazing work! Highly recommended..." rows="4" className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white resize-none" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Avatar URL</label>
                                    <input name="avatar" value={formData.avatar} onChange={handleChange} placeholder="https://example.com/avatar.jpg" className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-white/10 light-border text-white light-text font-bold text-xs rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={submitting} className="flex-1 py-3 bg-white text-gray-900 font-bold text-xs rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 cursor-pointer">
                                        {submitting ? 'Saving...' : editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
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

export default TestimonialsPage;
