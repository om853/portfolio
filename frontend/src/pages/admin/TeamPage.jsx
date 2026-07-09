import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const TeamPage = () => {
    const [team, setTeam] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'team'
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { 
        fetchTeam(); 
        fetchMe();
    }, []);

    const fetchMe = async () => {
        try {
            const response = await api.get('/auth/me/');
            setCurrentUser(response.data);
        } catch (error) {
            console.error('Failed to fetch current user');
        }
    };

    const fetchTeam = async () => {
        setLoading(true);
        try {
            const response = await api.get('/team');
            setTeam(response.data);
        } catch (error) {
            console.error('Failed to fetch team');
        } finally {
            setLoading(false);
        }
    };

    const isAdmin = currentUser?.role === 'admin';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '',
                role: user.role || 'team'
            });
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', role: 'team' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingUser) {
                await api.put(`/team/${editingUser.id}`, formData);
            } else {
                await api.post('/team', formData);
            }
            setShowModal(false);
            fetchTeam();
        } catch (error) {
            alert(editingUser ? 'Failed to update team member' : 'Failed to create team member');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this team member?')) return;
        try {
            await api.delete(`/team/${id}`);
            fetchTeam();
        } catch (error) {
            alert('Failed to remove team member');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white light-text">Team Management</h2>
                    <p className="text-[#adaaaa] light-muted text-xs">Manage your collaborators and their access levels.</p>
                </div>
                {isAdmin && (
                    <button onClick={() => openModal()} className="px-6 py-3 bg-white text-gray-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform cursor-pointer">
                        + ADD MEMBER
                    </button>
                )}
            </div>

            <div className="bg-[#1a1919] light-card border border-white/5 light-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[640px]">
                        <thead>
                            <tr className="border-b border-white/5 light-border text-[0.65rem] text-[#adaaaa] light-muted uppercase tracking-widest font-black">
                                <th className="px-6 py-5">Member</th>
                                <th className="px-4 py-5">Email</th>
                                <th className="px-4 py-5">Role</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 light-border">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-20 text-center"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                            ) : team.length > 0 ? (
                                team.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#2c2c2c] light-input border border-white/10 light-border flex items-center justify-center shrink-0 font-bold text-white">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <p className="font-bold text-white light-text text-sm">{user.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5 text-sm text-[#adaaaa] light-muted">{user.email}</td>
                                        <td className="px-4 py-5">
                                            <span className={`px-2 py-1 rounded-md text-[0.55rem] font-black uppercase tracking-widest border ${user.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                {isAdmin && user.id !== currentUser?.id && (
                                                    <>
                                                        <button onClick={() => openModal(user)} className="p-2 text-[#adaaaa] hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer">
                                                            <span className="material-symbols-outlined text-lg">edit</span>
                                                        </button>
                                                        <button onClick={() => handleDelete(user.id)} className="p-2 text-[#adaaaa] hover:text-[#ff6e84] hover:bg-[#ff6e84]/5 rounded-lg transition-all cursor-pointer">
                                                            <span className="material-symbols-outlined text-lg">delete</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="px-6 py-12 text-center text-[#adaaaa] text-sm font-bold uppercase tracking-widest">No team members found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
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
                            className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#1a1919] light-card border border-white/10 light-border rounded-2xl p-6 sm:p-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white light-text">{editingUser ? 'Edit Member' : 'Add Member'}</h3>
                                <button onClick={() => setShowModal(false)} className="text-[#adaaaa] hover:text-white cursor-pointer">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Full Name</label>
                                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Email Address</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                </div>
                                {(!editingUser) && (
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Password</label>
                                        <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Role</label>
                                    <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white cursor-pointer">
                                        <option value="team">Team Member</option>
                                        <option value="admin">Super Admin</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-white/10 light-border text-white light-text font-bold text-xs rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={submitting} className="flex-1 py-3 bg-white text-gray-900 font-bold text-xs rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 cursor-pointer">
                                        {submitting ? 'Saving...' : editingUser ? 'Update Member' : 'Add Member'}
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

export default TeamPage;
