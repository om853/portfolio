import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { buildWhatsAppUrl, buildLeadWhatsAppMessage } from '../config/contact';

const AIChatBubble = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [whatsappUrl, setWhatsappUrl] = useState(null);
    const messagesEndRef = useRef(null);
    const systemPromptSentRef = useRef(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ role: 'assistant', text: "Hi! I'm Omar's AI Assistant. Tell me a bit about your project, and I'll ask a few questions to help you craft a professional summary to send directly to Omar on WhatsApp." }]);
        }
    }, [isOpen, messages.length]);

    const systemPromptEn = `You are a professional project drafting and sales assistant for Omar. Your goal is to gather specific information from the user before summarizing their project.
Please ask the user interactively (one or two at a time) for:
1. Their full name → JSON key: "name"
2. Their WhatsApp/Phone number → JSON key: "phone"
3. Their budget range (e.g. < $1k, $1k-5k, $5k-10k, $10k+) → JSON key: "budget"
4. All their project needs and ideas → JSON key: "requirements"
5. Their email (optional) → JSON key: "email"

Once you have gathered all this information, you must do two things:
1. Generate a professional, concise project overview summarizing their needs for them to read.
2. AT THE VERY END of your response, output a strict JSON block wrapped in [LEAD_DATA]...[/LEAD_DATA] tags containing the collected data so the system can save it to the CRM.

IMPORTANT — Map each value to the correct JSON key:
- The person's name MUST go in "name"
- Their phone number MUST go in "phone"
- Their budget amount MUST go in "budget"
- Their project description MUST go in "requirements"
- Their email (if provided) MUST go in "email"

Format:
Here is a summary of your project...
(your conversational text here)
[LEAD_DATA]{"name":"John Doe", "phone":"+201234567890", "budget":"$1k-5k", "requirements":"E-commerce site with user accounts", "email":"john@example.com"}[/LEAD_DATA]`;



    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input.trim() };
        const currentMessages = [...messages, userMsg];
        setMessages(currentMessages);
        setInput('');
        setIsTyping(true);

        const normalizeResponseText = (data) => {
            if (data?.error) {
                throw new Error(data.error);
            }

            const choice = data?.choices?.[0] || null;
            const message = choice?.message || data?.message || null;

            if (message?.content) return message.content;
            if (message?.text) return message.text;
            if (choice?.text) return choice.text;
            if (typeof data?.text === 'string') return data.text;
            return '';
        };

        try {
            const apiMessages = currentMessages.map(m => ({ role: m.role, content: m.text }));

            if (!systemPromptSentRef.current) {
                apiMessages.unshift({
                    role: 'system',
                    content: systemPromptEn,
                });
                systemPromptSentRef.current = true;
            }

            const res = await api.post('/ai/chat/', {
                locale: 'en',
                messages: apiMessages,
            });

            let reply = normalizeResponseText(res.data);

            const leadDataMatch = reply.match(/\[LEAD_DATA\]\s*([\s\S]*?)\s*\[\/LEAD_DATA\]/i);
            let leadData = null;
            let summaryText = reply;

            if (leadDataMatch) {
                summaryText = reply.replace(/\[LEAD_DATA\][\s\S]*?\[\/LEAD_DATA\]/i, '').trim();

                try {
                    leadData = JSON.parse(leadDataMatch[1].trim());

                    await api.post('/leads/submit/', {
                        name: leadData.name,
                        email: leadData.email || '',
                        phone: leadData.phone,
                        budget: leadData.budget,
                        requirements: leadData.requirements,
                        source: 'ai_chat',
                        status: 'new',
                        notes: summaryText,
                    });

                    const waMessage = buildLeadWhatsAppMessage({
                        name: leadData.name,
                        phone: leadData.phone,
                        budget: leadData.budget,
                        requirements: leadData.requirements,
                        summary: summaryText,
                    });

                    const waUrl = buildWhatsAppUrl(waMessage);
                    setWhatsappUrl(waUrl);

                    summaryText += `\n\n[Send Summary to Omar on WhatsApp](${waUrl})`;

                    setTimeout(() => {
                        window.open(waUrl, '_blank', 'noopener,noreferrer');
                    }, 800);

                } catch (e) {
                    console.error('Failed to parse lead data or submit', e);
                    summaryText += '\n\n⚠️ Summary created but saving failed. You can still contact Omar directly on WhatsApp.';
                }
            }

            if (!summaryText) {
                summaryText = 'Sorry, an error occurred. Try again later.';
            }

            setMessages(prev => [...prev, { role: 'assistant', text: summaryText }]);
        } catch (error) {
            console.error('AI chat error', error);
            const fallback = 'Sorry, AI Service is currently unavailable. You can contact Omar directly on WhatsApp.';
            setMessages(prev => [...prev, { role: 'assistant', text: fallback }]);
        } finally {
            setIsTyping(false);
        }
    };

    const renderText = (text) => {
        const matches = [...text.matchAll(/\[(.*?)\]\((.*?)\)/g)];

        if (matches.length === 0) {
            return text.split('\n').map((line, j) => (
                <p key={j} className="whitespace-pre-wrap">{line}</p>
            ));
        }

        const elements = [];
        let lastIndex = 0;

        matches.forEach((match, i) => {
            elements.push(
                <span key={`text-${i}`} className="whitespace-pre-wrap">
                    {text.substring(lastIndex, match.index)}
                </span>
            );
            elements.push(
                <a
                    key={`link-${i}`}
                    href={match[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2.5 bg-gray-900 dark:bg-gray-200 text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity text-xs border border-gray-700 dark:border-gray-400"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {match[1]}
                </a>
            );
            lastIndex = match.index + match[0].length;
        });

        elements.push(
            <span key="text-end" className="whitespace-pre-wrap">
                {text.substring(lastIndex)}
            </span>
        );

        return <div>{elements}</div>;
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 left-4 lg:left-24 z-40 w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-slate-700 via-slate-800 to-slate-950 dark:from-slate-300 dark:via-slate-200 dark:to-slate-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-gray-600/30 dark:border-gray-400/30"
                aria-label="AI Project Assistant"
                title="AI Project Assistant"
            >
                <span className="material-symbols-outlined text-white dark:text-black text-xl">auto_awesome</span>
                <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -left-1 w-4 h-4 bg-gray-400 dark:bg-gray-600 rounded-full border-2 border-white dark:border-[#0e0e0e]"
                />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className={`fixed bottom-24 left-4 sm:left-6 z-50 w-[calc(100%-2rem)] sm:w-[400px] h-[500px] sm:h-[550px] bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-600/30 rounded-3xl flex flex-col overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.18)]`}
                    >
                        <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-400 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white dark:text-black text-sm">auto_awesome</span>
                                </div>
                                <div>
                                    <h3 className="text-white dark:text-black font-bold text-sm">Project Assistant</h3>
                                    <span className="text-white/70 dark:text-black/60 text-[0.5rem] font-bold uppercase tracking-widest">AI-Powered</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/70 dark:text-black/60 hover:text-white dark:hover:text-black transition-colors cursor-pointer" aria-label="Close chat">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-gray-900 dark:bg-gray-200 text-white dark:text-black rounded-br-sm' : 'bg-gray-100 dark:bg-slate-950 text-gray-700 dark:text-gray-300 rounded-bl-sm border border-gray-200 dark:border-slate-600/30'}`}>
                                        {renderText(msg.text)}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 dark:bg-slate-950 border border-gray-200 dark:border-slate-600/30 rounded-2xl rounded-bl-sm p-4 flex gap-1">
                                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full" />
                                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full" />
                                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {whatsappUrl && (
                            <div className="px-4 py-2 border-t border-gray-200 dark:border-slate-600/30 bg-gray-50 dark:bg-slate-950">
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 dark:bg-gray-200 text-white dark:text-black font-bold rounded-xl text-sm hover:opacity-90 transition-opacity"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                    Send Summary to Omar
                                </a>
                            </div>
                        )}

                        <div className="p-4 border-t border-gray-200 dark:border-slate-700/20 shrink-0 bg-gray-50 dark:bg-slate-950">
                            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2 relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-white dark:bg-slate-950 text-gray-900 dark:text-white text-sm rounded-xl py-4 border border-gray-200 dark:border-slate-600/30 focus:border-gray-900 dark:focus:border-slate-200 focus:ring-1 focus:ring-gray-900/30 dark:focus:ring-slate-200/30 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm pl-4 pr-14"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="absolute top-1/2 -translate-y-1/2 right-2 w-10 h-10 rounded-lg bg-gray-900 dark:bg-gray-200 text-white dark:text-black flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-400 transition-colors disabled:opacity-50 cursor-pointer"
                                    aria-label="Send message"
                                >
                                    <span className="material-symbols-outlined text-sm font-bold">send</span>
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIChatBubble;
