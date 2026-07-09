import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/public/Home';
import Login from './pages/admin/Login';
import AdminLayout from './layouts/AdminLayout';
import ToastContainer from './components/ui/ToastContainer';
import ProtectedRoute from './components/ProtectedRoute';

const DashboardIndex = lazy(() => import('./pages/admin/DashboardIndex'));
const ProjectsPage = lazy(() => import('./pages/admin/ProjectsPage'));
const MessagesPage = lazy(() => import('./pages/admin/MessagesPage'));
const ApiKeysPage = lazy(() => import('./pages/admin/ApiKeysPage'));
const SkillsPage = lazy(() => import('./pages/admin/SkillsPage'));
const ExperiencesPage = lazy(() => import('./pages/admin/ExperiencesPage'));
const TestimonialsPage = lazy(() => import('./pages/admin/TestimonialsPage'));
const LeadsPage = lazy(() => import('./pages/admin/LeadsPage'));
const TeamPage = lazy(() => import('./pages/admin/TeamPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));

const AdminFallback = () => (
  <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <LanguageProvider>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/dashboard" element={<Suspense fallback={<AdminFallback />}><DashboardIndex /></Suspense>} />
                <Route path="/dashboard/projects" element={<Suspense fallback={<AdminFallback />}><ProjectsPage /></Suspense>} />
                <Route path="/dashboard/skills" element={<Suspense fallback={<AdminFallback />}><SkillsPage /></Suspense>} />
                <Route path="/dashboard/experiences" element={<Suspense fallback={<AdminFallback />}><ExperiencesPage /></Suspense>} />
                <Route path="/dashboard/messages" element={<Suspense fallback={<AdminFallback />}><MessagesPage /></Suspense>} />
                <Route path="/dashboard/testimonials" element={<Suspense fallback={<AdminFallback />}><TestimonialsPage /></Suspense>} />
                <Route path="/dashboard/leads" element={<Suspense fallback={<AdminFallback />}><LeadsPage /></Suspense>} />
                <Route path="/dashboard/team" element={<Suspense fallback={<AdminFallback />}><TeamPage /></Suspense>} />
                <Route path="/dashboard/api-keys" element={<Suspense fallback={<AdminFallback />}><ApiKeysPage /></Suspense>} />
                <Route path="/dashboard/settings" element={<Suspense fallback={<AdminFallback />}><SettingsPage /></Suspense>} />
              </Route>
            </Route>

            <Route path="*" element={<div className="min-h-screen bg-[#0e0e0e] light-section flex flex-col items-center justify-center text-white light-text p-4">
              <h1 className="text-9xl font-black text-gray-900/5 dark:text-white/10 absolute select-none pointer-events-none">404</h1>
              <div className="relative z-10 text-center">
                <h2 className="text-4xl font-headline font-bold mb-4 uppercase tracking-tighter">LOST IN ORBIT.</h2>
                <p className="text-[#adaaaa] light-muted mb-8 max-w-sm mx-auto uppercase tracking-widest text-[0.6rem] font-bold">The page you're looking for doesn't exist in this system.</p>
                <a href="/" className="px-8 py-4 bg-gradient-to-r from-gray-200 dark:from-zinc-800 to-gray-600 dark:to-zinc-600 text-gray-900 dark:text-white rounded-xl font-black uppercase tracking-widest text-[0.7rem] hover:scale-105 transition-transform inline-block shadow-xl">Return to Base</a>
              </div>
            </div>} />
          </Routes>
          <ToastContainer />
        </LanguageProvider>
      </AuthProvider>
    </ToastProvider>
  </Router>
  );
}

export default App;
