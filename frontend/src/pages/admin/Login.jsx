import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import CustomCursor from '../../components/CustomCursor';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(credentials.email, credentials.password);
            navigate('/dashboard');
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Invalid email or password');
            } else if (err.code === 'ERR_NETWORK' || !err.response) {
                setError('Unable to connect to the server. Please check your connection or try again later.');
            } else {
                setError(err.response?.data?.error || err.message || 'Login failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen admin-bg flex items-center justify-center p-4">
            <CustomCursor />
            <div className="absolute inset-0 hero-gradient pointer-events-none opacity-50"></div>

            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass p-8 rounded-2xl border border-white/5 relative z-10 text-left"
            >
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black text-white light-text uppercase tracking-tighter mb-2">OMAR ADMIN</h1>
                    <p className="text-[#adaaaa] light-muted text-sm">Sign in to manage your portfolio</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error text-xs font-bold rounded-lg text-center uppercase tracking-widest">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Email Address</label>
                        <input 
                            required
                            type="email"
                            value={credentials.email}
                            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                            className="w-full bg-[#201f1f] border-b-2 border-[#333] focus:border-white focus:ring-0 text-white rounded-lg p-4 transition-all text-left outline-none"
                            placeholder="admin@omar.dev"
                            dir="ltr"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Password</label>
                        <input 
                            required
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            className="w-full bg-[#201f1f] border-b-2 border-[#333] focus:border-white focus:ring-0 text-white rounded-lg p-4 transition-all text-left outline-none"
                            placeholder="••••••••"
                            dir="ltr"
                        />
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full py-5 bg-white text-gray-900 font-black uppercase tracking-widest rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 cursor-pointer"
                        type="submit"
                    >
                        {loading ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD'}
                    </button>
                    
                    <a href="/" className="block text-center text-[#adaaaa] hover:text-white text-[0.6rem] uppercase tracking-widest font-bold transition-colors">
                        ← RETURN TO PUBLIC SITE
                    </a>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
