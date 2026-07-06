import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const ApiKeysPage = () => {
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingKey, setEditingKey] = useState(null);
    const [stats, setStats] = useState(null);
    const [formData, setFormData] = useState({
        provider: 'deepseek', type: 'rotation', key: '', label: '',
        daily_limit: 100, monthly_limit: 3000,
        expires_at: '', is_active: true, priority: 0, notes: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [showKey, setShowKey] = useState({});
    const [testKeyValue, setTestKeyValue] = useState('');
    const [testResult, setTestResult] = useState(null);
    const [testLoading, setTestLoading] = useState(false);

    useEffect(() => { fetchKeys(); fetchStats(); }, []);

    const fetchKeys = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api-keys/');
            setKeys(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('/api-keys/stats/');
            setStats(res.data);
        } catch (e) { console.error(e); }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const openModal = (key = null) => {
        if (key) {
            setEditingKey(key);
            setFormData({
                provider: key.provider, type: key.type || 'rotation', key: key.key, label: key.label || '',
                daily_limit: key.daily_limit, monthly_limit: key.monthly_limit,
                expires_at: key.expires_at ? key.expires_at.split('T')[0] : '',
                is_active: key.is_active, priority: key.priority, notes: key.notes || ''
            });
        } else {
            setEditingKey(null);
            setFormData({
                provider: 'deepseek', type: 'rotation', key: '', label: '',
                daily_limit: 100, monthly_limit: 3000,
                expires_at: '', is_active: true, priority: 0, notes: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                daily_limit: Number(formData.daily_limit),
                monthly_limit: Number(formData.monthly_limit),
                priority: Number(formData.priority),
                expires_at: formData.expires_at || null,
            };
            if (editingKey) {
                await api.put(`/api-keys/${editingKey.id}/`, payload);
            } else {
                await api.post('/api-keys/', payload);
            }
            setShowModal(false);
            fetchKeys();
            fetchStats();
        } catch (e) {
            alert('Failed to save API key');
        } finally {
            setSubmitting(false);
        }
    };

    const handleTestKey = async () => {
        if (!testKeyValue.trim()) return;
        setTestLoading(true);
        setTestResult(null);
        try {
            const res = await api.post('/api-keys/test/', { key: testKeyValue });
            setTestResult(res.data);
        } catch (e) {
            setTestResult({ valid: false, message: 'Failed to test key' });
        } finally {
            setTestLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this API key?')) return;
        try {
            await api.delete(`/api-keys/${id}/`);
            fetchKeys();
            fetchStats();
        } catch (e) { alert('Failed to delete'); }
    };

    const toggleActive = async (key) => {
        try {
            await api.put(`/api-keys/${key.id}/`, { is_active: !key.is_active });
            fetchKeys();
        } catch (e) { console.error(e); }
    };

    const resetLimits = async (type) => {
        if (!window.confirm(`Reset ${type} limits?`)) return;
        try {
            await api.post('/api-keys/reset/', { type });
            fetchKeys();
        } catch (e) { alert('Failed to reset'); }
    };

    const maskKey = (key) => {
        if (!key) return '';
        return key.substring(0, 8) + '...' + key.substring(key.length - 4);
    };

    const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Never';

    const getStatusColor = (key) => {
        if (!key.is_active) return 'text-[#adaaaa]';
        if (key.expires_at && new Date(key.expires_at) < new Date()) return 'text-[#ff6e84]';
        return 'text-green-400';
    };

    const getStatusLabel = (key) => {
        if (!key.is_active) return 'Inactive';
        if (key.expires_at && new Date(key.expires_at) < new Date()) return 'Expired';
        return 'Active';
    };

    const providers = ['deepseek', 'gemini', 'grok', 'together', 'huggingface', 'imgbb', 'custom'];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                <div>
                    <h2 className="text-xl font-bold text-white light-text">API Key Rotation</h2>
                    <p className="text-[#adaaaa] light-muted text-xs">Manage API keys with automatic rotation when limits hit.</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={() => resetLimits('daily')} className="px-4 py-2 bg-white/5 light-section text-white light-text text-xs font-bold rounded-lg hover:bg-white/10 transition-colors cursor-pointer">Reset Daily</button>
                    <button onClick={() => resetLimits('all')} className="px-4 py-2 bg-white/5 light-section text-white light-text text-xs font-bold rounded-lg hover:bg-white/10 transition-colors cursor-pointer">Reset All</button>
                    <button onClick={() => openModal()} className="px-6 py-2 bg-white text-gray-900 rounded-lg font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform cursor-pointer">+ Add Key</button>
                </div>
            </div>

            {/* Test Key Section */}
            <div className="bg-[#1a1919] light-card border border-white/5 light-border rounded-2xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <div className="flex-1 w-full">
                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold block mb-1">Test API Key</label>
                        <div className="flex gap-2">
                            <input value={testKeyValue} onChange={e => setTestKeyValue(e.target.value)} placeholder="Enter key to test..." className="flex-1 bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white font-mono" dir="ltr" />
                            <button onClick={handleTestKey} disabled={testLoading} className="px-4 py-2 bg-white text-gray-900 rounded-lg font-bold text-xs hover:bg-white/90 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap">{testLoading ? '...' : 'Test'}</button>
                        </div>
                    </div>
                    <button onClick={async () => { if (confirm('Rotate expired API keys?')) { const r = await api.post('/api-keys/rotate/'); alert(r.data.message); fetchKeys(); fetchStats(); } }} className="px-4 py-2 bg-[#ff6e84]/10 text-[#ff6e84] rounded-lg font-bold text-xs hover:bg-[#ff6e84]/20 transition-colors cursor-pointer">Rotate Keys</button>
                </div>
                {testResult && (
                    <div className={`mt-3 p-3 rounded-lg text-xs font-bold ${testResult.valid ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 'bg-[#ff6e84]/10 text-[#ff6e84] border border-[#ff6e84]/20'}`}>
                        <span className="uppercase tracking-widest">{testResult.valid ? '✅ VALID' : '❌ INVALID'}</span>
                        {testResult.message && <span> - {testResult.message}</span>}
                        {testResult.provider && <div className="mt-1 text-[0.55rem] opacity-75">{testResult.type?.toUpperCase()} | {testResult.provider} | {testResult.label} | Daily: {testResult.remaining_daily}/{testResult.daily_limit} | Monthly: {testResult.remaining_monthly}/{testResult.monthly_limit}</div>}
                    </div>
                )}
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Total Keys', value: stats.total_keys, icon: 'key' },
                        { label: 'Active', value: stats.active_keys, icon: 'check_circle' },
                        { label: 'Expired', value: stats.expired_keys, icon: 'error' },
                        { label: 'Static', value: stats.static_keys, icon: 'lock' },
                        { label: 'Rotation', value: stats.rotation_keys, icon: 'sync' },
                        { label: 'Providers', value: Object.keys(stats.keys_by_provider || {}).length, icon: 'cloud' },
                    ].map((s, i) => (
                        <div key={i} className="p-4 bg-[#1a1919] light-card border border-white/5 light-border rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-white text-sm">{s.icon}</span>
                                <span className="text-[0.6rem] text-[#adaaaa] light-muted uppercase font-bold">{s.label}</span>
                            </div>
                            <p className="text-2xl font-black text-white light-text text-left">{s.value}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-[#1a1919] light-card border border-white/5 light-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[900px] text-left">
                        <thead>
                            <tr className="border-b border-white/5 light-border text-[0.65rem] text-[#adaaaa] light-muted uppercase tracking-widest font-black">
                                <th className="px-6 py-4">Provider</th>
                                <th className="px-4 py-4">Type</th>
                                <th className="px-4 py-4">Label</th>
                                <th className="px-4 py-4">Key</th>
                                <th className="px-4 py-4">Daily</th>
                                <th className="px-4 py-4">Monthly</th>
                                <th className="px-4 py-4">Expires</th>
                                <th className="px-4 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 light-border">
                            {loading ? (
                                <tr><td colSpan="10" className="px-6 py-20 text-center"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                            ) : keys.length > 0 ? (
                                keys.map((k) => (
                                    <tr key={k.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-md bg-white/10 text-white text-[0.55rem] font-black uppercase">{k.provider}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[0.5rem] font-black uppercase ${k.type === 'static' ? 'bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20' : 'bg-gray-400/10 text-gray-400 border border-gray-400/20'}`}>
                                                {k.type || 'rotation'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-white light-text font-bold">{k.label || '-'}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <code className="text-[0.65rem] text-[#adaaaa] light-muted font-mono">{showKey[k.id] ? k.key : maskKey(k.key)}</code>
                                                <button onClick={() => setShowKey(prev => ({ ...prev, [k.id]: !prev[k.id] }))} className="text-[#adaaaa] hover:text-white cursor-pointer">
                                                    <span className="material-symbols-outlined text-sm">{showKey[k.id] ? 'visibility_off' : 'visibility'}</span>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-xs text-white light-text">{k.daily_used}/{k.daily_limit}</td>
                                        <td className="px-4 py-4 text-xs text-white light-text">{k.monthly_used}/{k.monthly_limit}</td>
                                        <td className="px-4 py-4 text-xs text-[#adaaaa] light-muted">{formatDate(k.expires_at)}</td>
                                        <td className="px-4 py-4">
                                            <span className={`text-[0.55rem] font-black uppercase ${getStatusColor(k)}`}>{getStatusLabel(k)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button onClick={() => toggleActive(k)} className="p-1.5 text-[#adaaaa] hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer" title={k.is_active ? 'Disable' : 'Enable'}>
                                                    <span className="material-symbols-outlined text-sm">{k.is_active ? 'pause' : 'play_arrow'}</span>
                                                </button>
                                                <button onClick={() => openModal(k)} className="p-1.5 text-[#adaaaa] hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer">
                                                    <span className="material-symbols-outlined text-sm">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete(k.id)} className="p-1.5 text-[#adaaaa] hover:text-[#ff6e84] hover:bg-[#ff6e84]/5 rounded-lg transition-all cursor-pointer">
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="10" className="px-6 py-12 text-center text-[#adaaaa] light-muted text-sm font-bold uppercase tracking-widest">No API keys. Add your first key.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#1a1919] light-card border border-white/10 light-border rounded-2xl p-6 sm:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white light-text">{editingKey ? 'Edit API Key' : 'Add API Key'}</h3>
                                <button onClick={() => setShowModal(false)} className="text-[#adaaaa] hover:text-white cursor-pointer"><span className="material-symbols-outlined">close</span></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Provider</label>
                                        <select name="provider" value={formData.provider} onChange={handleChange} className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white cursor-pointer">
                                            {providers.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Label</label>
                                        <input name="label" value={formData.label} onChange={handleChange} placeholder="e.g. Production Key" className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Key Type</label>
                                        <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white cursor-pointer">
                                            <option value="rotation">Rotation</option>
                                            <option value="static">Static</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Priority</label>
                                        <input type="number" name="priority" value={formData.priority} onChange={handleChange} className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">API Key</label>
                                    <input required name="key" value={formData.key} onChange={handleChange} placeholder="sk-..." className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white font-mono" dir="ltr" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Daily Limit</label>
                                        <input type="number" name="daily_limit" value={formData.daily_limit} onChange={handleChange} className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Monthly Limit</label>
                                        <input type="number" name="monthly_limit" value={formData.monthly_limit} onChange={handleChange} className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Expires At</label>
                                        <input type="date" name="expires_at" value={formData.expires_at} onChange={handleChange} className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white cursor-pointer" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Notes</label>
                                        <input name="notes" value={formData.notes} onChange={handleChange} placeholder="Additional notes..." className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                    </div>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="accent-white" />
                                    <span className="text-xs text-[#adaaaa] light-muted font-bold">Active</span>
                                </label>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-white/10 light-border text-white light-text font-bold text-xs rounded-xl hover:bg-white/5 transition-colors cursor-pointer">Cancel</button>
                                    <button type="submit" disabled={submitting} className="flex-1 py-3 bg-white text-gray-900 font-bold text-xs rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 cursor-pointer">{submitting ? 'Saving...' : editingKey ? 'Update' : 'Create'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ApiKeysPage;