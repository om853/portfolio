import React, { useState, useEffect, Suspense, lazy } from 'react';
import api from '../../services/api';
import ScrollToTopButton from '../../components/ScrollToTopButton';
import ScrollProgress from '../../components/ScrollProgress';
import CustomCursor from '../../components/CustomCursor';
import LoadingScreen from '../../components/LoadingScreen';
import NoiseOverlay from '../../components/NoiseOverlay';
import Marquee from '../../components/Marquee';
import WhatsAppBubble from '../../components/WhatsAppBubble';
import AIChatBubble from '../../components/AIChatBubble';
import Navbar from '../../components/sections/Navbar';
import Hero from '../../components/sections/Hero';
import About from '../../components/sections/About';

const Experience = lazy(() => import('../../components/sections/Experience'));
const Statistics = lazy(() => import('../../components/sections/Statistics'));
const Projects = lazy(() => import('../../components/sections/Projects'));
const Skills = lazy(() => import('../../components/sections/Skills'));
const Services = lazy(() => import('../../components/sections/Services'));
const Certificates = lazy(() => import('../../components/sections/Certificates'));
const Testimonials = lazy(() => import('../../components/sections/Testimonials'));
const Contact = lazy(() => import('../../components/sections/Contact'));
const Footer = lazy(() => import('../../components/sections/Footer'));

const SectionFallback = () => (
  <div className="py-24 flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin" />
  </div>
);

const Home = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const trackView = async () => {
            try {
                await api.post('/track/', { path: '/' });
            } catch {
                // silently fail
            }
        };
        trackView();
    }, []);

    return (
        <>
            {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
            
            <div className={`bg-gray-50 dark:bg-[#10131b] min-h-screen text-gray-900 dark:text-gray-100 selection:bg-slate-900 dark:selection:bg-slate-200 selection:text-white dark:selection:text-slate-950 font-body overflow-x-hidden transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                <CustomCursor />
                <ScrollProgress />
                <NoiseOverlay />
                <Navbar />
                <main>
                    <Hero />
                    <Marquee />
                    <About />
                    <Suspense fallback={<SectionFallback />}><Experience /></Suspense>
                    <Suspense fallback={<SectionFallback />}><Statistics /></Suspense>
                    <Suspense fallback={<SectionFallback />}><Projects /></Suspense>
                    <Suspense fallback={<SectionFallback />}><Skills /></Suspense>
                    <Suspense fallback={<SectionFallback />}><Services /></Suspense>
                    <Suspense fallback={<SectionFallback />}><Certificates /></Suspense>
                    <Suspense fallback={<SectionFallback />}><Testimonials /></Suspense>
                    <Suspense fallback={<SectionFallback />}><Contact /></Suspense>
                </main>
                <Suspense fallback={null}><Footer /></Suspense>
                <ScrollToTopButton />
                <WhatsAppBubble />
                <AIChatBubble />
            </div>
        </>
    );
};

export default Home;
