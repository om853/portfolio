import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { uploadImage } from '../../utils/upload';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '', title_ar: '', description: '', description_ar: '',
        type: 'web', link: '', github: '', image: '',
        photos: '', video: '', tech_stack: '', is_featured: false
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { fetchProjects(); }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await api.get('/projects/');
            setProjects(response.data);
        } catch (error) {
            console.error('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const openModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title || '',
                title_ar: project.title_ar || '',
                description: project.description || '',
                description_ar: project.description_ar || '',
                type: project.type || 'web',
                link: project.link || project.live_demo || '',
                github: project.github || '',
                image: project.image || '',
                photos: Array.isArray(project.photos) ? project.photos.join(', ') : (project.photos || ''),
                video: project.video || '',
                tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : (project.tech_stack || ''),
                is_featured: project.is_featured || false
            });
        } else {
            setEditingProject(null);
            setFormData({
                title: '', title_ar: '', description: '', description_ar: '',
                type: 'web', link: '', github: '', image: '',
                photos: '', video: '', tech_stack: '', is_featured: false
            });
        }
        setShowModal(true);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSubmitting(true);
        try {
            const url = await uploadImage(file);
            setFormData(prev => ({ ...prev, image: url }));
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Upload error', error);
            alert(error.message || 'Failed to upload image. Check API configuration.');
        } finally {
            setSubmitting(false);
            e.target.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                live_demo: formData.link,
                tech_stack: formData.tech_stack.split(',').map(t => t.trim()).filter(Boolean),
                photos: formData.photos.split(',').map(p => p.trim()).filter(Boolean),
            };
            delete payload.link;

            if (editingProject) {
                await api.put(`/projects/${editingProject.id}/`, payload);
            } else {
                await api.post('/projects/', payload);
            }
            setShowModal(false);
            fetchProjects();
        } catch (error) {
            alert(editingProject ? 'Failed to update project' : 'Failed to create project');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await api.delete(`/projects/${id}/`);
            fetchProjects();
        } catch (error) {
            alert('Failed to delete project');
        }
    };

    const projectTypes = [
        { value: 'web', label: 'Web Application' },
        { value: 'mobile', label: 'Mobile Application' },
        { value: 'desktop', label: 'Desktop Application' },
        { value: 'api', label: 'API / Backend' },
        { value: 'design', label: 'UI/UX Design' },
        { value: 'other', label: 'Other' }
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white light-text">Manage Projects</h2>
                    <p className="text-[#adaaaa] light-muted text-xs">A total of {projects.length} works in your portfolio.</p>
                </div>
                <button onClick={() => openModal()} className="px-6 py-3 bg-white text-gray-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform cursor-pointer">
                    + NEW PROJECT
                </button>
            </div>

            <div className="bg-[#1a1919] light-card border border-white/5 light-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[640px]">
                        <thead>
                            <tr className="border-b border-white/5 light-border text-[0.65rem] text-[#adaaaa] light-muted uppercase tracking-widest font-black">
                                <th className="px-6 py-5">Project</th>
                                <th className="px-4 py-5">Type</th>
                                <th className="px-4 py-5">Tech Stack</th>
                                <th className="px-4 py-5">Status</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 light-border">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-20 text-center"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                            ) : projects.length > 0 ? (
                                projects.map((project) => (
                                    <tr key={project.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-10 rounded-lg bg-[#2c2c2c] light-input border border-white/10 light-border overflow-hidden shrink-0">
                                                    <img src={project.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"} className="w-full h-full object-cover" alt={project.title} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-white light-text text-sm truncate">{project.title}</p>
                                                    <p className="text-[0.6rem] text-[#adaaaa] light-muted uppercase tracking-tighter">ID: {project.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="px-2 py-1 rounded-md bg-gray-400/10 text-gray-400 text-[0.55rem] font-black uppercase tracking-widest border border-gray-400/20">
                                                {project.type || 'web'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <div className="flex flex-wrap gap-1">
                                                {project.tech_stack?.slice(0, 3).map(t => (
                                                    <span key={t} className="px-2 py-0.5 rounded-full bg-white/5 text-white/60 text-[0.5rem] font-bold uppercase">{t}</span>
                                                ))}
                                                {project.tech_stack?.length > 3 && <span className="text-[0.5rem] text-[#adaaaa]">+{project.tech_stack.length - 3}</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            {project.is_featured ? (
                                                <span className="px-2 py-1 rounded-md bg-white/10 text-white text-[0.55rem] font-black uppercase tracking-widest border border-white/20">Featured</span>
                                            ) : (
                                                <span className="text-[0.55rem] text-[#adaaaa] uppercase font-bold">Standard</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openModal(project)} className="p-2 text-[#adaaaa] hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer">
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete(project.id)} className="p-2 text-[#adaaaa] hover:text-[#ff6e84] hover:bg-[#ff6e84]/5 rounded-lg transition-all cursor-pointer">
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-[#adaaaa] text-sm font-bold uppercase tracking-widest">No projects found. Create your first work.</td></tr>
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
                            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1919] light-card border border-white/10 light-border rounded-2xl p-6 sm:p-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white light-text">{editingProject ? 'Edit Project' : 'New Project'}</h3>
                                <button onClick={() => setShowModal(false)} className="text-[#adaaaa] hover:text-white cursor-pointer">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Title (EN)</label>
                                        <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Title (AR)</label>
                                        <input name="title_ar" value={formData.title_ar} onChange={handleChange} className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Description (EN)</label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white resize-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Description (AR)</label>
                                        <textarea name="description_ar" value={formData.description_ar} onChange={handleChange} rows="3" className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white resize-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Project Type</label>
                                        <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white cursor-pointer">
                                            {projectTypes.map(pt => <option key={pt.value} value={pt.value}>{pt.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Tech Stack (comma separated)</label>
                                        <input name="tech_stack" value={formData.tech_stack} onChange={handleChange} placeholder="React, Laravel, MySQL" className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Live Demo Link</label>
                                        <input name="link" value={formData.link} onChange={handleChange} placeholder="https://..." className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">GitHub Link</label>
                                        <input name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/..." className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Cover Image URL or Upload</label>
                                        <div className="flex gap-2">
                                            <input name="image" value={formData.image} onChange={handleChange} placeholder="https://..." className="flex-1 bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                            <label className="bg-white/10 text-white border border-white/20 px-4 py-3 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={submitting} />
                                                <span className="material-symbols-outlined text-sm">upload</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Video URL</label>
                                        <input name="video" value={formData.video} onChange={handleChange} placeholder="https://youtube.com/..." className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[0.6rem] uppercase tracking-widest text-[#adaaaa] light-muted font-bold">Photo URLs (comma separated)</label>
                                    <input name="photos" value={formData.photos} onChange={handleChange} placeholder="https://img1.jpg, https://img2.jpg" className="w-full bg-[#2c2c2c] light-input border border-white/10 light-border text-white light-text rounded-lg p-3 text-sm outline-none focus:border-white" />
                                </div>

                                <div className="flex items-center gap-3">
                                    <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} id="featured" className="accent-white" />
                                    <label htmlFor="featured" className="text-xs text-[#adaaaa] light-muted font-bold cursor-pointer">Mark as Featured Project</label>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-white/10 light-border text-white light-text font-bold text-xs rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={submitting} className="flex-1 py-3 bg-white text-gray-900 font-bold text-xs rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 cursor-pointer">
                                        {submitting ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
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

export default ProjectsPage;