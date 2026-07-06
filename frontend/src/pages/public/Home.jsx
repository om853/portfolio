import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ScrollToTopButton from '../../components/ScrollToTopButton';
import ScrollProgress from '../../components/ScrollProgress';
import CustomCursor from '../../components/CustomCursor';
import LoadingScreen from '../../components/LoadingScreen';
import NoiseOverlay from '../../components/NoiseOverlay';
import Marquee from '../../components/Marquee';
import WhatsAppBubble from '../../components/WhatsAppBubble';
import AIChatBubble from '../../components/AIChatBubble';

import Hero from '../../components/sections/Hero';
import About from '../../components/sections/About';
import Experience from '../../components/sections/Experience';
import Statistics from '../../components/sections/Statistics';
import Projects from '../../components/sections/Projects';
import Skills from '../../components/sections/Skills';
import Services from '../../components/sections/Services';
import Certificates from '../../components/sections/Certificates';
import Testimonials from '../../components/sections/Testimonials';
import Contact from '../../components/sections/Contact';
import Navbar from '../../components/sections/Navbar';
import Footer from '../../components/sections/Footer';

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

    // no persisted grayscale toggle — public UI uses improved global gray palette

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
                    <Experience />
                    <Statistics />
                    <Projects />
                    <Skills />
                    <Services />
                    <Certificates />
                    <Testimonials />
                    <Contact />
                </main>
                <Footer />
                <ScrollToTopButton />
                <WhatsAppBubble />
                <AIChatBubble />
            </div>
        </>
    );
};

export default Home;