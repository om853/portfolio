import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/public/Home';
import Login from './pages/admin/Login';
import DashboardIndex from './pages/admin/DashboardIndex';
import ProjectsPage from './pages/admin/ProjectsPage';
import MessagesPage from './pages/admin/MessagesPage';
import ApiKeysPage from './pages/admin/ApiKeysPage';
import SkillsPage from './pages/admin/SkillsPage';
import ExperiencesPage from './pages/admin/ExperiencesPage';
import TestimonialsPage from './pages/admin/TestimonialsPage';
import LeadsPage from './pages/admin/LeadsPage';
import TeamPage from './pages/admin/TeamPage';
import SettingsPage from './pages/admin/SettingsPage';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/dashboard" element={<DashboardIndex />} />
                <Route path="/dashboard/projects" element={<ProjectsPage />} />
                <Route path="/dashboard/skills" element={<SkillsPage />} />
                <Route path="/dashboard/experiences" element={<ExperiencesPage />} />
                <Route path="/dashboard/messages" element={<MessagesPage />} />
                <Route path="/dashboard/testimonials" element={<TestimonialsPage />} />
                <Route path="/dashboard/leads" element={<LeadsPage />} />
                <Route path="/dashboard/team" element={<TeamPage />} />
                <Route path="/dashboard/api-keys" element={<ApiKeysPage />} />
                <Route path="/dashboard/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<div className="min-h-screen bg-[#0e0e0e] light-section flex flex-col items-center justify-center text-white light-text p-4">
              <h1 className="text-9xl font-black text-gray-900/5 dark:text-white/10 absolute select-none pointer-events-none">404</h1>
              <div className="relative z-10 text-center">
                <h2 className="text-4xl font-headline font-bold mb-4 uppercase tracking-tighter">LOST IN ORBIT.</h2>
                <p className="text-[#adaaaa] light-muted mb-8 max-w-sm mx-auto uppercase tracking-widest text-[0.6rem] font-bold">The page you're looking for doesn't exist in this system.</p>
                <a href="/" className="px-8 py-4 bg-gradient-to-r from-gray-200 dark:from-zinc-800 to-gray-600 dark:to-zinc-600 text-gray-900 dark:text-white rounded-xl font-black uppercase tracking-widest text-[0.7rem] hover:scale-105 transition-transform inline-block shadow-xl">Return to Base</a>
              </div>
            </div>} />
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
