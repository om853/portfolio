import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../../services/api';

const StatCard = ({ title, value, icon, color, subtitle }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-[#1a1919] light-card border border-white/5 light-border rounded-2xl"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl`} style={{ backgroundColor: `${color}15` }}>
                <span className="material-symbols-outlined" style={{ color }}>{icon}</span>
            </div>
            <span className="text-[0.6rem] font-bold text-[#adaaaa] uppercase tracking-widest">Live</span>
        </div>
        <h3 className="text-3xl font-black text-white light-text">{value}</h3>
        <p className="text-[0.6rem] text-[#adaaaa] light-muted uppercase tracking-widest font-bold mt-1">{title}</p>
        {subtitle && <p className="text-[0.5rem] text-[#adaaaa]/60 light-muted mt-1">{subtitle}</p>}
    </motion.div>
);

const InsightCard = ({ insight, index }) => {
    const colors = { up: '#4ade80', down: '#ff6e84', neutral: '#9ca3af' };
    const icons = { up: 'trending_up', down: 'trending_down', neutral: 'remove_red_eye' };
    const accent = colors[insight.trend] || '#ffffff';

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white/5 rounded-xl border border-white/5"
        >
            <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-sm" style={{ color: accent }}>{icons[insight.trend]}</span>
                <p className="text-[0.65rem] font-bold uppercase" style={{ color: accent }}>{insight.title}</p>
                {insight.change !== null && insight.change !== undefined && (
                    <span className="text-[0.5rem] font-black ml-auto uppercase tracking-widest" style={{ color: accent }}>
                        {insight.trend === 'up' ? '+' : ''}{insight.change}%
                    </span>
                )}
            </div>
            <p className="text-xs text-[#adaaaa] font-medium leading-relaxed">{insight.message}</p>
        </motion.div>
    );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-[#1a1919] border border-gray-200 dark:border-[#494847] rounded-xl p-3 text-xs shadow-lg">
                <p className="text-gray-900 dark:text-white font-bold mb-1">{new Date(label).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }} className="font-medium">
                        {p.name}: <span className="font-black">{p.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const DashboardIndex = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const strokeColor = isDark ? '#ffffff' : '#0f172a';
    const gridColor = isDark ? '#262626' : '#e2e8f0';
    const textColor = isDark ? '#adaaaa' : '#64748b';

    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/stats/');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

    const viewData = stats?.hits_by_date || [];
    const insights = stats?.insights || [];
    const dayData = stats?.hits_by_day_of_week || [];
    const skillsData = stats?.skills_by_category || [];

    const SKILL_COLORS = ['#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827'];

    const statCards = [
        { title: 'Total Projects', value: stats?.total_projects || 0, icon: 'deployed_code', color: '#ffffff', subtitle: `${stats?.total_project_views || 0} total views` },
        { title: 'Unread Messages', value: stats?.unread_messages || 0, icon: 'mail', color: '#9ca3af', subtitle: `${stats?.response_rate || 0}% response rate` },
        { title: 'Total Visitors', value: stats?.total_visitors || 0, icon: 'group', color: '#9ca3af', subtitle: stats?.visitor_change !== undefined ? `${stats.visitor_change >= 0 ? '+' : ''}${stats.visitor_change}% vs last week` : '' },
        { title: 'Page Views', value: stats?.total_page_views || 0, icon: 'visibility', color: '#ff6e84', subtitle: stats?.view_change !== undefined ? `${stats.view_change >= 0 ? '+' : ''}${stats.view_change}% vs last week` : '' },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, i) => (
                    <StatCard key={i} {...card} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart - 30 day views */}
                <div className="lg:col-span-2 p-8 bg-[#1a1919] light-card border border-white/5 light-border rounded-2xl flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white light-text">Visitor Trends (Last 30 Days)</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-white" />
                                <span className="text-[0.5rem] text-[#adaaaa] uppercase tracking-widest font-bold">Views</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" />
                                <span className="text-[0.5rem] text-[#adaaaa] uppercase tracking-widest font-bold">Week Avg</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1" style={{ minHeight: 0 }}>
                        {viewData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={viewData}>
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke={textColor}
                                        fontSize={10}
                                        tickFormatter={(str) => {
                                            const d = new Date(str);
                                            return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
                                        }}
                                        tick={{ fill: textColor }}
                                    />
                                    <YAxis stroke={textColor} fontSize={10} tick={{ fill: textColor }} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        name="Views"
                                        stroke={strokeColor}
                                        fillOpacity={1}
                                        fill="url(#colorViews)"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 4, fill: strokeColor }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-[#adaaaa] text-xs font-bold uppercase tracking-widest">
                                No visitor data yet. Visit the public site to generate analytics.
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Insights Panel */}
                <div className="p-8 bg-[#1a1919] light-card border border-white/5 light-border rounded-2xl flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-white light-text">
                            <span className="material-symbols-outlined text-sm">auto_awesome</span>
                            AI INSIGHTS
                        </h3>
                        <button
                            onClick={fetchStats}
                            className="text-[0.5rem] font-bold text-[#adaaaa] hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-xs">refresh</span>
                            Refresh
                        </button>
                    </div>

                    <div className="space-y-4 flex-1 overflow-y-auto">
                        {insights.length > 0 ? (
                            insights.map((insight, i) => (
                                <InsightCard key={i} insight={insight} index={i} />
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <span className="material-symbols-outlined text-3xl text-[#adaaaa]/30 mb-2 block">insights</span>
                                <p className="text-xs text-[#adaaaa] font-medium">Not enough data for insights yet. Generate traffic to see analytics.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Secondary Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Day of Week Distribution */}
                <div className="p-8 bg-[#1a1919] light-card border border-white/5 light-border rounded-2xl">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white light-text mb-6">Views by Day</h3>
                    {dayData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={dayData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                <XAxis dataKey="day" stroke={textColor} fontSize={9} tick={{ fill: textColor }} />
                                <YAxis stroke={textColor} fontSize={10} tick={{ fill: textColor }} allowDecimals={false} />
                                <Tooltip contentStyle={{ background: isDark ? '#1a1919' : '#ffffff', border: '1px solid', borderColor: isDark ? '#494847' : '#e2e8f0', borderRadius: '12px', fontSize: '10px', color: isDark ? '#ffffff' : '#0f172a' }} />
                                <Bar dataKey="count" name="Views" radius={[4, 4, 0, 0]}>
                                    {dayData.map((_, i) => (
                                        <Cell key={i} fill={i % 2 === 0 ? '#9ca3af' : '#6b7280'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[200px] text-[#adaaaa] dark:text-[#64748b] text-xs font-bold uppercase tracking-widest">No data</div>
                    )}
                </div>

                {/* Skills Distribution */}
                            <div className="p-8 bg-[#1a1919] light-card border border-white/5 light-border rounded-2xl">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white light-text mb-6">Skills by Category</h3>
                    {skillsData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={skillsData}
                                    dataKey="count"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={2}
                                >
                                    {skillsData.map((_, i) => (
                                        <Cell key={i} fill={SKILL_COLORS[i % SKILL_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: isDark ? '#1a1919' : '#ffffff', border: '1px solid', borderColor: isDark ? '#494847' : '#e2e8f0', borderRadius: '12px', fontSize: '10px', color: isDark ? '#ffffff' : '#0f172a' }} />
                                <Legend
                                    wrapperStyle={{ fontSize: '9px', color: textColor }}
                                    formatter={(value) => <span style={{ color: textColor }}>{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[200px] text-[#adaaaa] dark:text-[#64748b] text-xs font-bold uppercase tracking-widest">No skills data</div>
                    )}
                </div>

                {/* Top Pages */}
                <div className="p-8 bg-[#1a1919] light-card border border-white/5 light-border rounded-2xl">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white light-text mb-6">Top Pages</h3>
                    {stats?.top_pages?.length > 0 ? (
                        <div className="space-y-3">
                            {stats.top_pages.map((page, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="text-[0.55rem] font-black text-[#adaaaa] w-4 shrink-0">#{i + 1}</span>
                                        <code className="text-xs text-white font-mono truncate">{page.path}</code>
                                    </div>
                                    <span className="text-xs font-bold text-white shrink-0 ml-2">{page.count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-[200px] text-[#adaaaa] text-xs font-bold uppercase tracking-widest">No page data</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardIndex;
