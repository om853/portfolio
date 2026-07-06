import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const CheckMarks = ({ isRead }) => (
    <span className={`text-xs ${isRead ? 'text-blue-400' : 'text-gray-500'}`}>
        {isRead ? (
            <svg viewBox="0 0 32 16" className="w-5 h-2.5 inline-block" fill="currentColor">
                <path d="M1.5 8.5l3 3 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 8.5l3 3 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(7,0)" />
            </svg>
        ) : (
            <svg viewBox="0 0 32 16" className="w-5 h-2.5 inline-block" fill="currentColor">
                <path d="M1.5 8.5l3 3 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 8.5l3 3 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(7,0)" />
            </svg>
        )}
    </span>
);

const MessagesPage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showReply, setShowReply] = useState(false);
    const [replyForm, setReplyForm] = useState({ subject: '', body: '' });
    const [sending, setSending] = useState(false);
    const [sendStatus, setSendStatus] = useState({ type: '', msg: '' });

    useEffect(() => { fetchMessages(); }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await api.get('/messages/');
            setMessages(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            await api.delete(`/messages/${id}/`);
            setMessages(messages.filter(m => m.id !== id));
            if (selectedMessage?.id === id) setSelectedMessage(null);
        } catch (e) { alert('Failed to delete'); }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/messages/${id}/`, { is_read: true });
            setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
        } catch (e) { console.error(e); }
    };

    const openReply = () => {
        setReplyForm({
            subject: `Re: Your Project Inquiry - Omar Elshahat`,
            body: `Hello ${selectedMessage.name},\n\nThank you for reaching out! I've reviewed your message and would love to discuss your project further.\n\nBest regards,\nOmar Mohamed Elshahat`
        });
        setShowReply(true);
    };

    const sendReply = async () => {
        if (!replyForm.subject || !replyForm.body) return;
        setSending(true);
        setSendStatus({ type: '', msg: '' });
        try {
            await api.post('/mail/reply/', {
                message_id: selectedMessage.id,
                subject: replyForm.subject,
                body: replyForm.body,
            });
            setSendStatus({ type: 'success', msg: 'Email sent successfully!' });
            setShowReply(false);
            fetchMessages();
        } catch (e) {
            setSendStatus({ type: 'error', msg: e.response?.data?.error || e.message || 'Failed to send email' });
        } finally {
            setSending(false);
        }
    };

    const formatTime = (date) => new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit'
    });
    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    const formatDateLine = (date) => {
        const d = new Date(date);
        const now = new Date();
        const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)] -m-4 sm:-m-8">
            {/* WhatsApp-style chat header */}
            <div className="shrink-0 px-4 sm:px-6 py-3 bg-[#202020] border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2c2c2c] border border-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-lg">forum</span>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white">Messages</h2>
                        <p className="text-[0.6rem] text-gray-500">{messages.filter(m => !m.is_read).length} unread</p>
                    </div>
                </div>
                <button onClick={fetchMessages} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer" title="Refresh">
                    <span className="material-symbols-outlined text-lg">refresh</span>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>
            ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
                    <span className="material-symbols-outlined text-5xl mb-4">mail</span>
                    <p className="text-sm font-bold uppercase tracking-widest">No messages yet</p>
                </div>
            ) : (
                <div className="flex flex-1 min-h-0">
                    {/* Chat list - WhatsApp style */}
                    <div className={`${selectedMessage ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-96 xl:w-[28rem] border-r border-white/5 overflow-y-auto`}>
                        {messages.map((msg, idx) => (
                            <motion.div key={msg.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                                onClick={() => { setSelectedMessage(msg); markAsRead(msg.id); setShowReply(false); }}
                                className={`flex items-center gap-3 px-4 sm:px-5 py-3 cursor-pointer transition-colors border-b border-white/[0.02] ${selectedMessage?.id === msg.id ? 'bg-[#2a2a2a]' : 'hover:bg-[#222]'} ${!msg.is_read ? 'bg-[#1e2a2e] hover:bg-[#243238]' : ''}`}
                            >
                                <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${!msg.is_read ? 'bg-[#00a884] text-white' : 'bg-[#2c2c2c] text-gray-400'}`}>
                                    {getInitials(msg.name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h4 className={`text-sm truncate ${!msg.is_read ? 'font-bold text-white' : 'font-medium text-gray-300'}`}>{msg.name}</h4>
                                        <span className="text-[0.55rem] text-gray-500 shrink-0 ml-2">{formatTime(msg.created_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CheckMarks isRead={msg.is_read} />
                                        <p className="text-xs text-gray-500 truncate flex-1">{msg.message}</p>
                                    </div>
                                </div>
                                {!msg.is_read && <div className="w-2 h-2 rounded-full bg-[#00a884] shrink-0" />}
                            </motion.div>
                        ))}
                    </div>

                    {/* Chat detail - WhatsApp bubble style */}
                    <div className={`${selectedMessage ? 'flex' : 'hidden lg:flex'} flex-1 flex-col min-w-0 bg-[#0b141a]`}>
                        {selectedMessage ? (
                            <>
                                {/* Contact header */}
                                <div className="shrink-0 px-4 sm:px-6 py-3 bg-[#202020] border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold bg-[#00a884] text-white`}>
                                            {getInitials(selectedMessage.name)}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white">{selectedMessage.name}</h3>
                                            <div className="flex items-center gap-1.5 text-[0.55rem] text-gray-500">
                                                <CheckMarks isRead={selectedMessage.is_read} />
                                                <span>{selectedMessage.is_read ? 'Read' : 'Delivered'}</span>
                                                {selectedMessage.phone && <><span>·</span><span>{selectedMessage.phone}</span></>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={openReply} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer" title="Reply">
                                            <span className="material-symbols-outlined text-lg">reply</span>
                                        </button>
                                        <button onClick={() => handleDelete(selectedMessage.id)} className="p-2 text-gray-400 hover:text-[#ff6e84] hover:bg-[#ff6e84]/5 rounded-lg transition-all cursor-pointer" title="Delete">
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                        <button onClick={() => setSelectedMessage(null)} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all lg:hidden cursor-pointer">
                                            <span className="material-symbols-outlined text-lg">close</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Chat area with bubble */}
                                {!showReply ? (
                                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIi8+PC9zdmc+')]">
                                        {/* Date divider */}
                                        <div className="flex justify-center mb-4">
                                            <span className="px-2 py-1 text-[0.55rem] text-gray-500 bg-[#182229] rounded">{formatDateLine(selectedMessage.created_at)}</span>
                                        </div>

                                        {/* Sender info chip */}
                                        <div className="flex items-center gap-2 mb-2 ml-1">
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1f2c33] rounded-full">
                                                <span className="material-symbols-outlined text-gray-400 text-sm">mail</span>
                                                <span className="text-[0.55rem] text-gray-400">{selectedMessage.email}</span>
                                            </div>
                                            {selectedMessage.phone && (
                                                <a href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 bg-[#1f2c33] rounded-full hover:bg-[#2a3b43] transition-colors">
                                                    <span className="material-symbols-outlined text-[#25d366] text-sm">call</span>
                                                    <span className="text-[0.55rem] text-gray-400">WhatsApp</span>
                                                </a>
                                            )}
                                        </div>

                                        {/* Message bubble */}
                                        <div className="flex justify-start">
                                            <div className="max-w-[85%] sm:max-w-[75%] bg-[#1f2c33] rounded-lg rounded-tl-none px-3 py-2 shadow-sm">
                                                {selectedMessage.subject && (
                                                    <p className="text-[0.55rem] text-[#00a884] font-bold uppercase tracking-wider mb-1.5">{selectedMessage.subject}</p>
                                                )}
                                                <p className="text-sm text-gray-100 whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
                                                <div className="flex justify-end items-center gap-1 mt-1">
                                                    <span className="text-[0.5rem] text-gray-500">{formatTime(selectedMessage.created_at)}</span>
                                                    <CheckMarks isRead={selectedMessage.is_read} />
                                                </div>
                                            </div>
                                        </div>

                                        {selectedMessage.replied_at && (
                                            <>
                                                <div className="flex justify-center my-3">
                                                    <span className="px-2 py-1 text-[0.55rem] text-green-500 bg-[#182229] rounded">Replied</span>
                                                </div>
                                                <div className="flex justify-end">
                                                    <div className="max-w-[85%] sm:max-w-[75%] bg-[#005c4b] rounded-lg rounded-tr-none px-3 py-2 shadow-sm">
                                                        <p className="text-sm text-gray-100">{replyForm.body ? `Re: ${selectedMessage.subject || 'Inquiry'}` : (selectedMessage.subject ? `Re: ${selectedMessage.subject}` : 'Reply sent')}</p>
                                                        <div className="flex justify-end items-center gap-1 mt-1">
                                                            <span className="text-[0.5rem] text-gray-400">{formatTime(selectedMessage.replied_at)}</span>
                                                            <CheckMarks isRead={true} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div className="flex justify-center mt-4">
                                            <a href={`mailto:${selectedMessage.email}`} className="px-4 py-2 bg-[#1f2c33] text-gray-300 text-[0.6rem] font-bold rounded-full hover:bg-[#2a3b43] transition-colors inline-flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-sm">mail</span>
                                                Reply via Email
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-[0.55rem] uppercase tracking-widest text-gray-500 font-bold">To</label>
                                            <div className="w-full bg-[#1f2c33] border border-white/5 text-gray-300 rounded-lg p-2.5 text-xs">{selectedMessage.email}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[0.55rem] uppercase tracking-widest text-gray-500 font-bold">Subject</label>
                                            <input value={replyForm.subject} onChange={e => setReplyForm({...replyForm, subject: e.target.value})} className="w-full bg-[#1f2c33] border border-white/5 text-white rounded-lg p-2.5 text-xs outline-none focus:border-white/20" />
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <label className="text-[0.55rem] uppercase tracking-widest text-gray-500 font-bold">Message</label>
                                            <textarea value={replyForm.body} onChange={e => setReplyForm({...replyForm, body: e.target.value})} rows="8" className="w-full bg-[#1f2c33] border border-white/5 text-white rounded-lg p-2.5 text-xs outline-none focus:border-white/20 resize-none" />
                                        </div>
                                        {sendStatus.msg && (
                                            <div className={`p-2.5 rounded-lg text-xs font-bold ${sendStatus.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-[#ff6e84]/10 text-[#ff6e84] border border-[#ff6e84]/20'}`}>
                                                {sendStatus.msg}
                                            </div>
                                        )}
                                        <div className="flex gap-2 pt-2">
                                            <button onClick={() => setShowReply(false)} className="flex-1 py-2.5 border border-white/5 text-gray-300 font-bold text-xs rounded-xl hover:bg-white/5 transition-colors cursor-pointer">Cancel</button>
                                            <button onClick={sendReply} disabled={sending} className="flex-1 py-2.5 bg-[#00a884] text-white font-bold text-xs rounded-xl hover:bg-[#00a884]/90 transition-colors disabled:opacity-50 cursor-pointer">
                                                {sending ? 'Sending...' : 'Send'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <span className="material-symbols-outlined text-5xl mb-4">chat</span>
                                <p className="text-sm font-bold uppercase tracking-widest">Select a message</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessagesPage;