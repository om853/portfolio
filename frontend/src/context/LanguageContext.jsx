import React, { createContext, useContext } from 'react';

const LanguageContext = createContext({ t: (k) => k });

export const useLanguage = () => useContext(LanguageContext);

const translations = {
    nav_work: 'Work',
    nav_about: 'About',
    nav_skills: 'Skills',
    nav_certs: 'Certs',
    nav_contact: 'Contact',
    get_in_touch: 'GET IN TOUCH',
    hero_available: 'Available for projects',
    hero_hi: "Hi, I'm",
    hero_sub: 'Full Stack Developer specializing in React.js frontend, Laravel backend, API design, and animations.',
    view_work: 'VIEW WORK',
    hero_focus_title: 'Current Focus',
    hero_focus_value: 'Full Stack Development (React.js & Laravel)',
    hero_years: 'Years',
    about_title: '01 // IDENTITY',
    about_subtitle: 'Building full-stack digital experiences with passion and precision.',
    about_p1: "I'm Omar Mohamed Elshahat, a Full Stack Developer specialized in React.js frontend and Laravel/PHP backend. I build complete web applications from database design to interactive UIs, with animations and responsive design.",
    about_p2: 'Expertise spans both frontend (React.js, Tailwind CSS, Framer Motion, JavaScript/TypeScript) and backend (Laravel, PHP, OOP, MVC, RESTful APIs, JWT auth, payment integration, MySQL, MongoDB). Full-stack problem solver.',
    projects_title: '02 // PORTFOLIO',
    projects_headline: 'Selected Work.',
    projects_sub: 'A curation of high-impact digital products built with performance and scalability in mind.',
    no_projects: 'No projects found. Stay tuned!',
    live_demo: 'LIVE DEMO',
    github: 'GITHUB',
    skills_title: '03 // EXPERTISE',
    skills_headline: 'My Tech Stack & Skills',
    skills_sub: 'A comprehensive collection of tools, technologies, and methodologies I utilize to bring ideas to life.',
    services_title: 'SERVICES',
    services_headline: 'What I Offer',
    services_sub: 'High-quality engineering custom-built for your business needs.',
    certs_title: 'CERTIFICATES',
    certs_headline: 'My Achievements',
    certs_sub: 'Proof of dedication, learning, and technical proficiency.',
    testimonials_title: 'TESTIMONIALS',
    testimonials_headline: 'Client Feedback',
    testimonials_sub: 'What people say about collaborating with me.',
    contact_title: '04 // COLLABORATE',
    contact_headline: 'Ready to start?',
    contact_sub: "Let's work together to build something remarkable.",
    your_name: 'Your Name',
    email_address: 'Email Address',
    project_overview: 'Project Overview',
    placeholder_name: 'John Doe',
    placeholder_email: 'mrmhmdalshhatly@gmail.com',
    placeholder_message: 'Tell me about your vision...',
    sending: 'SENDING...',
    send_message: 'SEND MESSAGE',
    msg_success: 'Message sent successfully! I will get back to you soon.',
    msg_error: 'Failed to send message. Please try again or email me directly.',
    footer_all_rights: 'All rights reserved.',
};

export const LanguageProvider = ({ children }) => {
    const t = (key) => translations[key] || key;

    return (
        <LanguageContext.Provider value={{ t }}>
            {children}
        </LanguageContext.Provider>
    );
};