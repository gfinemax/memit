import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import MobileScrollWrapper from '@/components/mobile/MobileScrollWrapper';
import MobileTopBar from '@/components/mobile/MobileTopBar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-background-dark text-white min-h-screen flex overflow-hidden selection:bg-primary selection:text-white transition-colors duration-300">
            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden md:flex">
                <Sidebar />
            </div>

            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Background Gradient */}
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none z-0"></div>

                {/* Desktop Header */}
                <div className="hidden md:block">
                    <Header />
                </div>


                {/* Mobile Top Bar */}
                <div className="block md:hidden">
                    <MobileTopBar />
                </div>

                <MobileScrollWrapper hasTopBar={true}>
                    {children}
                </MobileScrollWrapper>
            </main >
        </div >
    );
}
