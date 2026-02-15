'use client';

import React from 'react';
import Link from 'next/link';
import { Brain } from 'lucide-react';

export default function LandingHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Brain className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white font-display">
                        MEMIT <span className="text-primary-light font-medium ml-1">AI</span>
                    </span>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#about" className="hover:text-white transition-colors">About</a>
                    <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                </nav>

                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/login"
                        className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-light text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}
