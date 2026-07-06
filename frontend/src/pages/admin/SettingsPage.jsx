import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { uploadImage } from '../../utils/upload';

const SettingsPage = () => {
    const { user, refreshUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        avatar: '',
        hero_image: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '',
                avatar: user.avatar || '',
                hero_image: user.hero_image || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageUpload = async (e, field = 'avatar') => {
        const file = e.target.files[0];
        if (!file) return;

        setSubmitting(true);
        try {
            const url = await uploadImage(file);
            setFormData(prev => ({ ...prev, [field]: url }));
            setMessage({ type: 'success', text: `${field === 'avatar' ? 'Avatar' : 'Hero image'} uploaded successfully!` });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to upload image.' });
        } finally {
            setSubmitting(false);
            e.target.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        const payload = {
            name: formData.name,
            email: formData.email,
            avatar: formData.avatar,
            hero_image: formData.hero_image
        };
        
        if (formData.password.trim()) {
            payload.password = formData.password;
        }

        try {
            const res = await api.put('/auth/profile/', payload);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            refreshUser();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h2 className="text-xl font-bold text-white light-text">Profile Settings</h2>
                <p className="text-[#adaaaa] light-muted text-xs">Manage your personal information and profile picture.</p>
            </div>

            {message && (
                <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-[#1a1919] light-card border border-white/5 light-border rounded-2xl p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/5 light-border">
                        <div className="w-24 h-24 rounded-full bg-[#2c2c2c] light-input border-2 border-white/10 light-border overflow-hidden shrink-0">
                            {formData.avatar ? (
                                <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-[#adaaaa]">person</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2 text-center sm:text-left flex-1 w-full">
                            <label className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-lg inline-flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors text-xs font-bold uppercase tracking-widest">
                                <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'avatar')} disabled={submitting} />
                                <span className="material-symbols-outlined text-sm mr-2">upload</span>
                                Upload New Photo
                            </label>
                            <p className="text-[0.65rem] text-[#adaaaa] light-muted">Recommended size: 500x500px (Max 10MB)</p>
                            
                            <div className="mt-4">
                                <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold block mb-1">Or provide Avatar URL</label>
                                <input name="avatar" value={formData.avatar} onChange={handleChange} placeholder="https://..." className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-2 text-sm outline-none focus:border-white" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 light-border space-y-4">
                        <h3 className="text-sm font-bold text-white light-text uppercase tracking-widest">Hero Section Image</h3>
                        {formData.hero_image && (
                            <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10">
                                <img src={formData.hero_image} alt="Hero preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex gap-3">
                            <input 
                                name="hero_image" 
                                value={formData.hero_image || ''} 
                                onChange={handleChange} 
                                placeholder="Enter Hero image URL..." 
                                className="flex-1 bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" 
                            />
                            <label className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-lg inline-flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                                <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'hero_image')} disabled={submitting} />
                                <span className="material-symbols-outlined text-sm mr-2">upload</span>
                                Upload
                            </label>
                        </div>
                        <p className="text-[0.6rem] text-[#adaaaa] light-muted">This image will be displayed in the background or side of the hero section.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Display Name</label>
                            <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Email Address</label>
                            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">New Password (leave blank to keep current)</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button type="submit" disabled={submitting} className="px-8 py-3 bg-white text-gray-900 font-bold text-xs rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 cursor-pointer uppercase tracking-widest">
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;
