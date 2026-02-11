import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-background-dark text-white min-h-screen flex overflow-hidden selection:bg-primary selection:text-white transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Background Gradient */}
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none z-0"></div>

                <Header />

                <div className="flex-1 overflow-y-auto p-6 lg:p-10 z-10 scroll-smooth relative">
                    {children}
                </div>
            </main>
        </div>
    );
}
