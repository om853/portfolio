import React, { useState, useEffect, useRef } from 'react';

const CustomCursor = () => {
    const containerRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        let mouseX = -200;
        let mouseY = -200;
        let dotX = -200;
        let dotY = -200;
        let ringX = -200;
        let ringY = -200;
        let animId = null;
        let shown = false;

        const dotEl = document.createElement('div');
        const ringEl = document.createElement('div');

        const isInitialDark = document.documentElement.classList.contains('dark');
        let isDarkTheme = isInitialDark;

        const applyCursorTheme = (dark) => {
            isDarkTheme = dark;
            dotEl.style.backgroundColor = dark ? '#ffffff' : '#000000';
            dotEl.style.boxShadow = dark ? '0 0 12px 2px rgba(255, 255, 255, 0.25)' : '0 0 12px 2px rgba(0, 0, 0, 0.3)';
            ringEl.style.borderColor = dark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.3)';
            ringEl.style.backgroundColor = dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
            ringEl.style.boxShadow = dark ? '0 0 30px 4px rgba(255, 255, 255, 0.12)' : '0 0 20px 2px rgba(0, 0, 0, 0.1)';
        };

        // Style the dot
        Object.assign(dotEl.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: '9999',
            transform: 'translate3d(-200px, -200px, 0)',
            willChange: 'transform',
        });

        // Style the ring
        Object.assign(ringEl.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: '9998',
            transform: 'translate3d(-200px, -200px, 0)',
            willChange: 'transform',
            transition: 'border-color 0.3s ease, background-color 0.3s ease, width 0.3s ease, height 0.3s ease, box-shadow 0.3s ease',
        });

        applyCursorTheme(isInitialDark);

        document.body.appendChild(dotEl);
        document.body.appendChild(ringEl);

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!shown) {
                shown = true;
                setIsVisible(true);
            }
        };

        const render = () => {
            // Dot follows almost instantly (increased from 0.5 to 0.8 for snappier feel)
            dotX += (mouseX - dotX) * 0.8;
            dotY += (mouseY - dotY) * 0.8;

            // Ring follows dot with a tighter lag (increased from 0.15 to 0.3 for better responsiveness)
            ringX += (dotX - ringX) * 0.3;
            ringY += (dotY - ringY) * 0.3;

            dotEl.style.transform = `translate3d(${dotX - 6}px, ${dotY - 6}px, 0)`;
            ringEl.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0)`;

            animId = requestAnimationFrame(render);
        };

        const handleMouseEnter = () => { dotEl.style.opacity = '1'; ringEl.style.opacity = '1'; };
        const handleMouseLeave = () => { dotEl.style.opacity = '0'; ringEl.style.opacity = '0'; };

        const handleHoverStart = () => {
            setIsHovering(true);
            ringEl.style.borderColor = isDarkTheme ? '#ffffff' : '#000000';
            ringEl.style.backgroundColor = isDarkTheme ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';
            ringEl.style.width = '60px';
            ringEl.style.height = '60px';
            ringEl.style.boxShadow = isDarkTheme ? '0 0 30px 4px rgba(255, 255, 255, 0.15)' : '0 0 30px 4px rgba(0, 0, 0, 0.15)';
        };
        const handleHoverEnd = () => {
            setIsHovering(false);
            ringEl.style.borderColor = isDarkTheme ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.3)';
            ringEl.style.backgroundColor = 'transparent';
            ringEl.style.width = '40px';
            ringEl.style.height = '40px';
            ringEl.style.boxShadow = isDarkTheme ? '0 0 20px 2px rgba(255, 255, 255, 0.1)' : '0 0 20px 2px rgba(0, 0, 0, 0.1)';
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);

        const observer = new MutationObserver(() => {
            applyCursorTheme(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        animId = requestAnimationFrame(render);

        const updateHoverListeners = () => {
            const els = document.querySelectorAll('a, button, [role="button"], input, textarea, select, [data-cursor-hover]');
            els.forEach(el => {
                el.removeEventListener('mouseenter', handleHoverStart);
                el.removeEventListener('mouseleave', handleHoverEnd);
                el.addEventListener('mouseenter', handleHoverStart);
                el.addEventListener('mouseleave', handleHoverEnd);
            });
        };

        updateHoverListeners();
        const interval = setInterval(updateHoverListeners, 2000);

        // Tell CSS that the custom cursor is active so it can hide the default one
        document.body.classList.add('custom-cursor-active');

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
            observer.disconnect();
            cancelAnimationFrame(animId);
            clearInterval(interval);
            dotEl.remove();
            ringEl.remove();
            document.body.classList.remove('custom-cursor-active');
        };
    }, []);

    // This component renders nothing in React - cursor is pure DOM
    return null;
};

export default CustomCursor;