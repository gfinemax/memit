'use client';

import React, { useEffect, useRef, useState } from 'react';
import MobileBottomNav from './MobileBottomNav';
import { eventBus, APP_EVENTS } from '@/lib/events';

interface MobileScrollWrapperProps {
    children: React.ReactNode;
    hasTopBar?: boolean;
}

export default function MobileScrollWrapper({ children, hasTopBar = false }: MobileScrollWrapperProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showNav, setShowNav] = useState(true);
    const lastScrollTop = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!scrollRef.current) return;

            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    const currentScrollTop = scrollRef.current?.scrollTop || 0;
                    const diff = currentScrollTop - lastScrollTop.current;

                    // Logic:
                    // Downscroll (> 0) & moved more than 10px -> Hide
                    // Upscroll (< 0) & moved more than 10px -> Show
                    // Buffer of 10px prevents jitter

                    if (Math.abs(diff) > 10) { // Threshold reduced for better responsiveness
                        if (diff > 0 && showNav) {
                            setShowNav(false);
                            eventBus.emit(APP_EVENTS.SET_NAV_VISIBILITY, false);
                        } else if (diff < 0 && !showNav) {
                            setShowNav(true);
                            eventBus.emit(APP_EVENTS.SET_NAV_VISIBILITY, true);
                        }
                        lastScrollTop.current = currentScrollTop;
                    }
                    ticking.current = false;
                });

                ticking.current = true;
            }
        };

        const currentRef = scrollRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, [showNav]);

    // Calculate top padding: Safe Area + (Header Height if present)
    // Header height is h-12 (3rem)
    const paddingTopClass = hasTopBar
        ? 'pt-[calc(env(safe-area-inset-top)+3rem)]'
        : 'pt-[env(safe-area-inset-top)]';

    return (
        <div className="flex-1 overflow-hidden relative flex flex-col">
            {/* Main Scrollable Area */}
            <div
                ref={scrollRef}
                className={`flex-1 overflow-y-auto scroll-smooth no-scrollbar ${paddingTopClass} pb-24`}
            >
                {children}
            </div>

            {/* Mobile Bottom Navigation (Floating) */}
            <div className={`
                fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out md:hidden
                ${showNav ? 'translate-y-0' : 'translate-y-full'}
            `}>
                <MobileBottomNav />
            </div>
        </div>
    );
}
