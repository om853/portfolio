import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const STATUS_COLORS = {
    new: { bg: 'bg-gray-400/10', text: 'text-gray-400', border: 'border-gray-400/20' },
    contacted: { bg: 'bg-yellow-400/10', text: 'text-yellow-400', border: 'border-yellow-400/20' },
    qualified: { bg: 'bg-purple-400/10', text: 'text-purple-400', border: 'border-purple-400/20' },
    proposal_sent: { bg: 'bg-orange-400/10', text: 'text-orange-400', border: 'border-orange-400/20' },
    won: { bg: 'bg-green-400/10', text: 'text-green-400', border: 'border-green-400/20' },
    lost: { bg: 'bg-[#ff6e84]/10', text: 'text-[#ff6e84]', border: 'border-[#ff6e84]/20' },
};

const STATUSES = ['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'];

const StatCard = ({ title, value, icon, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-[#1a1919] light-card border border-white/5 light-border rounded-2xl"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}15` }}>
                <span className="material-symbols-outlined" style={{ color }}>{icon}</span>
            </div>
        </div>
        <h3 className="text-3xl font-black text-white light-text">{value}</h3>
        <p className="text-[0.6rem] text-[#adaaaa] light-muted uppercase tracking-widest font-bold mt-1">{title}</p>
    </motion.div>
);

const LeadsPage = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedLead, setSelectedLead] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(null);

    useEffect(() => { fetchLeads(); }, []);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const response = await api.get('/leads/');
            setLeads(response.data);
        } catch (error) {
            console.error('Failed to fetch leads');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) return;
        try {
            await api.delete(`/leads/${id}/`);
            setLeads(leads.filter(l => l.id !== id));
            if (selectedLead?.id === id) setSelectedLead(null);
        } catch (error) {
            alert('Failed to delete lead');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        setUpdatingStatus(id);
        try {
            await api.put(`/leads/${id}/`, { status: newStatus });
            setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
            if (selectedLead?.id === id) setSelectedLead(prev => ({ ...prev, status: newStatus }));
        } catch (error) {
            alert('Failed to update status');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }) : '-';

    const filteredLeads = leads.filter(lead => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (lead.name?.toLowerCase().includes(q) || lead.email?.toLowerCase().includes(q));
    });

    const stats = {
        total: leads.length,
        qualified: leads.filter(l => l.status === 'qualified').length,
        won: leads.filter(l => l.status === 'won').length,
        lost: leads.filter(l => l.status === 'lost').length,
    };

    const getWhatsAppLink = (lead) => {
        const phone = lead.phone?.replace(/[^0-9]/g, '');
        if (!phone) return null;
        const msg = encodeURIComponent(`Hi ${lead.name}! Thanks for reaching out. I'd love to discuss your project further.`);
        return `https://wa.me/${phone}?text=${msg}`;
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white light-text">Leads CRM</h2>
                    <p className="text-[#adaaaa] light-muted text-xs">{leads.length} total leads in your pipeline.</p>
                </div>
                <button onClick={fetchLeads} className="px-4 py-2 bg-white/5 text-white text-xs font-bold rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">refresh</span> Refresh
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard title="Total Leads" value={stats.total} icon="group" color="#ffffff" />
                <StatCard title="Qualified" value={stats.qualified} icon="checklist" color="#a855f7" />
                <StatCard title="Won" value={stats.won} icon="emoji_events" color="#4ade80" />
                <StatCard title="Lost" value={stats.lost} icon="cancel" color="#ff6e84" />
            </div>

            <div className="flex gap-3 items-center">
                <div className="relative flex-1 max-w-sm">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#adaaaa] text-sm">search</span>
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-white"
                    />
                </div>
                {search && (
                    <button onClick={() => setSearch('')} className="text-[0.6rem] text-[#adaaaa] hover:text-white font-bold uppercase tracking-widest cursor-pointer">Clear</button>
                )}
            </div>

            <div className="bg-[#1a1919] light-card border border-white/5 light-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="border-b border-white/5 light-border text-[0.65rem] text-[#adaaaa] light-muted uppercase tracking-widest font-black">
                                <th className="px-6 py-5">Name</th>
                                <th className="px-4 py-5">Contact</th>
                                <th className="px-4 py-5">Company</th>
                                <th className="px-4 py-5">Budget</th>
                                <th className="px-4 py-5">Timeline</th>
                                <th className="px-4 py-5">Status</th>
                                <th className="px-4 py-5">Source</th>
                                <th className="px-4 py-5">Created</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 light-border">
                            {loading ? (
                                <tr><td colSpan="9" className="px-6 py-20 text-center"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                            ) : filteredLeads.length > 0 ? (
                                filteredLeads.map((lead) => {
                                    const sc = STATUS_COLORS[lead.status] || STATUS_COLORS.new;
                                    return (
                                        <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-5">
                                                <button onClick={() => setSelectedLead(lead)} className="text-left">
                                                    <p className="font-bold text-white light-text text-sm hover:text-white transition-colors">{lead.name}</p>
                                                </button>
                                            </td>
                                            <td className="px-4 py-5">
                                                <div className="flex flex-col gap-0.5">
                                                    <a href={`mailto:${lead.email}`} className="text-xs text-white hover:underline">{lead.email}</a>
                                                    {lead.phone && <span className="text-[0.6rem] text-[#adaaaa] light-muted">{lead.phone}</span>}
                                                </div>
                                            </td>
                                            <td className="px-4 py-5">
                                                <span className="text-sm text-white light-text">{lead.company || '-'}</span>
                                            </td>
                                            <td className="px-4 py-5">
                                                <span className="text-xs text-white light-text font-bold">{lead.budget || '-'}</span>
                                            </td>
                                            <td className="px-4 py-5">
                                                <span className="text-xs text-[#adaaaa] light-muted">{lead.timeline || '-'}</span>
                                            </td>
                                            <td className="px-4 py-5">
                                                <div className="relative inline-block">
                                                    <select
                                                        value={lead.status}
                                                        onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                                                        disabled={updatingStatus === lead.id}
                                                        className={`px-2 py-1 rounded-md text-[0.55rem] font-black uppercase tracking-widest border appearance-none cursor-pointer outline-none ${sc.bg} ${sc.text} ${sc.border}`}
                                                    >
                                                        {STATUSES.map(s => (
                                                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                                                        ))}
                                                    </select>
                                                    {updatingStatus === lead.id && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                                                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-5">
                                                <span className="text-[0.55rem] text-[#adaaaa] font-bold uppercase tracking-widest">{lead.source || 'Direct'}</span>
                                            </td>
                                            <td className="px-4 py-5">
                                                <span className="text-[0.6rem] text-[#adaaaa] light-muted">{formatDate(lead.created_at)}</span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-1">
                                                    {lead.phone && (() => {
                                                        const wa = getWhatsAppLink(lead);
                                                        return wa ? (
                                                            <a href={wa} target="_blank" rel="noopener noreferrer" className="p-2 text-[#adaaaa] hover:text-green-400 hover:bg-green-400/5 rounded-lg transition-all" title="WhatsApp">
                                                                <span className="material-symbols-outlined text-lg">chat</span>
                                                            </a>
                                                        ) : null;
                                                    })()}
                                                    <button onClick={() => setSelectedLead(lead)} className="p-2 text-[#adaaaa] hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer" title="View Details">
                                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                                    </button>
                                                    <button onClick={() => handleDelete(lead.id)} className="p-2 text-[#adaaaa] hover:text-[#ff6e84] hover:bg-[#ff6e84]/5 rounded-lg transition-all cursor-pointer">
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan="9" className="px-6 py-12 text-center text-[#adaaaa] light-muted text-sm font-bold uppercase tracking-widest">{search ? 'No leads match your search.' : 'No leads found yet.'}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {selectedLead && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedLead(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#1a1919] light-card border border-white/10 light-border rounded-2xl p-6 sm:p-8"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white light-text">{selectedLead.name}</h3>
                                    {selectedLead.position && (
                                        <p className="text-xs text-[#adaaaa] light-muted">{selectedLead.position}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {(selectedLead.phone && (() => {
                                        const wa = getWhatsAppLink(selectedLead);
                                        return wa ? (
                                            <a href={wa} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold rounded-lg hover:bg-green-500/20 transition-colors flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">chat</span> WhatsApp
                                            </a>
                                        ) : null;
                                    })())}
                                    <button onClick={() => setSelectedLead(null)} className="text-[#adaaaa] hover:text-white cursor-pointer">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-[0.5rem] uppercase tracking-widest text-[#adaaaa] font-bold mb-1">Email</p>
                                        <a href={`mailto:${selectedLead.email}`} className="text-xs text-white hover:underline break-all">{selectedLead.email}</a>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-[0.5rem] uppercase tracking-widest text-[#adaaaa] font-bold mb-1">Phone</p>
                                        <p className="text-xs text-white light-text">{selectedLead.phone || '-'}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-[0.5rem] uppercase tracking-widest text-[#adaaaa] font-bold mb-1">Company</p>
                                        <p className="text-xs text-white light-text">{selectedLead.company || '-'}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-[0.5rem] uppercase tracking-widest text-[#adaaaa] font-bold mb-1">Budget</p>
                                        <p className="text-xs text-white light-text font-bold">{selectedLead.budget || '-'}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-[0.5rem] uppercase tracking-widest text-[#adaaaa] font-bold mb-1">Timeline</p>
                                        <p className="text-xs text-white light-text">{selectedLead.timeline || '-'}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-[0.5rem] uppercase tracking-widest text-[#adaaaa] font-bold mb-1">Status</p>
                                        <select
                                            value={selectedLead.status}
                                            onChange={(e) => handleStatusUpdate(selectedLead.id, e.target.value)}
                                            disabled={updatingStatus === selectedLead.id}
                                            className={`px-2 py-1 rounded-md text-[0.55rem] font-black uppercase tracking-widest border appearance-none cursor-pointer outline-none ${STATUS_COLORS[selectedLead.status]?.bg} ${STATUS_COLORS[selectedLead.status]?.text} ${STATUS_COLORS[selectedLead.status]?.border}`}
                                        >
                                            {STATUSES.map(s => (
                                                <option key={s} value={s}>{s.replace('_', ' ')}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-[0.5rem] uppercase tracking-widest text-[#adaaaa] font-bold mb-1">Source</p>
                                        <p className="text-xs text-white light-text">{selectedLead.source || 'Direct'}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-[0.5rem] uppercase tracking-widest text-[#adaaaa] font-bold mb-1">Created</p>
                                        <p className="text-xs text-white light-text">{formatDate(selectedLead.created_at)}</p>
                                    </div>
                                </div>

                                {selectedLead.notes && (
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-[0.5rem] uppercase tracking-widest text-[#adaaaa] font-bold mb-2">Notes</p>
                                        <p className="text-xs text-[#adaaaa] light-muted whitespace-pre-wrap leading-relaxed">{selectedLead.notes}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-6">
                                <button type="button" onClick={() => setSelectedLead(null)} className="flex-1 py-3 border border-white/10 light-border text-white light-text font-bold text-xs rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                                    Close
                                </button>
                                <button
                                    onClick={() => { handleDelete(selectedLead.id); }}
                                    className="px-6 py-3 bg-[#ff6e84]/10 text-[#ff6e84] border border-[#ff6e84]/20 font-bold text-xs rounded-xl hover:bg-[#ff6e84]/20 transition-colors cursor-pointer"
                                >
                                    Delete Lead
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LeadsPage;
