'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
    BookOpen,
    Fingerprint,
    Key,
    ArrowRight,
    Brain,
    Lock,
    ShieldCheck,
    ChevronDown
} from 'lucide-react';

import StorytellingLanding from '@/components/landing/StorytellingLanding';

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();

    const handleGoogleLogin = async () => {
        if (!supabase) {
            alert('Supabase 설정이 완료되지 않았습니다. .env.local 파일을 확인해주세요.');
            return;
        }

        try {
            const origin = typeof window !== 'undefined' ? window.location.origin : '';
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consensus',
                    }
                },
            });
            if (error) throw error;
        } catch (error: any) {
            console.error('Error logging in with Google:', error);
            if (error.message && error.message.includes('provider is not enabled')) {
                alert('Supabase 프로젝트에서 Google 로그인이 활성화되지 않았습니다.\nAuthentication > Providers > Google을 활성화해주세요.');
            } else {
                alert('구글 로그인 중 오류가 발생했습니다.');
            }
        }
    };

    const handleGuestLogin = () => {
        // Guest Demo Mode
        router.push('/dashboard');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-display min-h-screen flex flex-col overflow-x-hidden">
            {/* Top Fold: Split Screen Login */}
            <div className="flex flex-col lg:flex-row min-h-screen relative z-10 shrink-0">
                {/* Left Side: Cinematic Visual */}
                <div className="relative w-full lg:w-[60%] h-[40vh] lg:h-screen overflow-hidden group">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear group-hover:scale-110"
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAfEvM89iUtqmmEq-6fzfqSP1B1KzDOv8y1h6Yp0EXng41JXO3sI9xxvyWiAdYTSN0KHBtk0FPKBwgvhGukDZGVcdI2qPv3ZLsHUreh4rogV0mBzWf_xLd7SOJNkbIQcU2Tn0vqYj6CLsLhR4-nhHk6SoAMCDWaNbVKA8arcgjV2u9uZ7-KN9ZFYbG4jGn00DG42tTcjVd9E9_OgX43pP-ZpquO_r2tS92QZZ-LDxOfWgySl8WnEJ_ebB0zwYPk724BgWeDGmt1DrA0')" }}
                    >
                    </div>
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-background-dark/90 via-background-dark/40 to-transparent lg:bg-gradient-to-t lg:from-background-dark/90 lg:via-primary/20 lg:to-transparent mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-dark lg:to-transparent"></div>

                    {/* Storytelling Content */}
                    <div className="absolute inset-0 flex flex-col justify-center px-8 lg:px-24 z-10 text-white">
                        <div className="max-w-2xl">
                            <div className="w-12 h-1 bg-primary mb-8 rounded-full fade-in-text"></div>
                            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6 fade-in-text fade-in-delay-1 tracking-tight">
                                당신의 기억은 <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary/80">어디에 있나요?</span>
                            </h1>
                            <p className="text-lg lg:text-xl text-slate-300 font-light leading-relaxed fade-in-text fade-in-delay-2 border-l-2 border-primary pl-6">
                                Memit이 당신의 기억을 웅장한 궁전으로 만들어 드립니다. <br className="hidden lg:block" />
                                흩어진 조각들을 모아 영원한 별자리로 기록하세요.
                            </p>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-10 left-10 opacity-50 fade-in-text">
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">MEMIT • PALACE OS V0.7</span>
                    </div>
                </div>

                {/* Right Side: Interaction Area */}
                <div className="relative w-full lg:w-[40%] flex flex-col justify-center items-center h-[60vh] lg:h-screen bg-background-dark overflow-hidden">
                    {/* Animated Background Particles */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary rounded-full blur-[1px] star-particle" style={{ animationDuration: '4s' }}></div>
                        <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full blur-[2px] star-particle" style={{ animationDuration: '7s', animationDelay: '1s' }}></div>
                        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-primary/60 rounded-full blur-[1px] star-particle" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
                        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-indigo-500/40 rounded-full blur-[3px] star-particle" style={{ animationDuration: '6s' }}></div>
                        {/* Large abstract glow */}
                        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/20 rounded-full blur-[80px]"></div>
                    </div>

                    {/* Login Container */}
                    <div className="w-full max-w-md px-6 z-10">
                        {/* Mobile Header (Only visible on small screens inside this pane) */}
                        <div className="lg:hidden mb-6 text-center">
                            <h2 className="text-2xl font-bold text-white">Enter the Palace</h2>
                            <p className="text-slate-400 text-sm">Sign in to access your memory archive</p>
                        </div>

                        {/* Glass Card */}
                        <div className="glass-panel p-8 rounded-2xl floating-element relative overflow-hidden">
                            {/* Subtle top highlight for glass effect */}
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>

                            <div className="text-center mb-8 hidden lg:block">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary mb-4 border border-primary/30 shadow-[0_0_15px_rgba(140,43,238,0.3)]">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
                                <p className="text-slate-400 text-sm mt-1">Access your Neural Archive</p>
                            </div>

                            <form className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wider" htmlFor="email">Identity / Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Fingerprint className="text-slate-500 group-focus-within:text-primary transition-colors w-5 h-5" />
                                        </div>
                                        <input
                                            className="block w-full pl-10 pr-3 py-3 bg-background-dark/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                                            id="email"
                                            placeholder="nomad@memit.ai"
                                            type="email"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-xs font-medium text-slate-300 uppercase tracking-wider" htmlFor="password">Access Key</label>
                                        <a className="text-xs text-primary hover:text-primary-light transition-colors" href="#">Forgot key?</a>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Key className="text-slate-500 group-focus-within:text-primary transition-colors w-5 h-5" />
                                        </div>
                                        <input
                                            className="block w-full pl-10 pr-3 py-3 bg-background-dark/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                                            id="password"
                                            placeholder="••••••••"
                                            type="password"
                                        />
                                    </div>
                                </div>

                                <button
                                    className="w-full relative group overflow-hidden rounded-lg p-[1px]"
                                    type="button"
                                    onClick={handleGuestLogin}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600 rounded-lg"></div>
                                    <div className="relative px-6 py-3.5 bg-background-dark rounded-lg group-hover:bg-opacity-0 transition-all duration-300 ease-out">
                                        <span className="relative flex items-center justify-center gap-2 text-white font-semibold tracking-wide group-hover:scale-105 transition-transform">
                                            Guest Login (Demo)
                                            <ArrowRight className="w-5 h-5" />
                                        </span>
                                    </div>
                                </button>
                            </form>

                            <div className="mt-6 flex items-center justify-center gap-4">
                                <div className="h-[1px] w-12 bg-slate-700"></div>
                                <span className="text-xs text-slate-500">or connect via</span>
                                <div className="h-[1px] w-12 bg-slate-700"></div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    className="flex items-center justify-center px-4 py-2 border border-slate-700 rounded-lg bg-slate-800/30 hover:bg-slate-700/50 transition-colors text-slate-300 text-sm"
                                    onClick={handleGoogleLogin}
                                >
                                    <svg aria-hidden="true" className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"></path></svg>
                                    Google
                                </button>
                                <button className="flex items-center justify-center px-4 py-2 border border-slate-700 rounded-lg bg-slate-800/30 hover:bg-slate-700/50 transition-colors text-slate-300 text-sm">
                                    <svg aria-hidden="true" className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
                                    Facebook
                                </button>
                            </div>
                        </div>

                        {/* Bottom Icons: Core Values */}
                        <div className="mt-10 flex justify-center items-center gap-12">
                            <div className="flex flex-col items-center group cursor-help">
                                <div className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300">
                                    <Brain className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] uppercase tracking-wider mt-2 text-slate-500 font-medium group-hover:text-primary/80 transition-colors">Smart</span>
                            </div>
                            <div className="flex flex-col items-center group cursor-help">
                                <div className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] uppercase tracking-wider mt-2 text-slate-500 font-medium group-hover:text-primary/80 transition-colors">Secret</span>
                            </div>
                            <div className="flex flex-col items-center group cursor-help">
                                <div className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] uppercase tracking-wider mt-2 text-slate-500 font-medium group-hover:text-primary/80 transition-colors">Safe</span>
                            </div>
                        </div>


                    </div>
                </div>

                {/* Scroll Guide (Absolute Positioned) */}
                {/* Bottom Overlay Container */}
                <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-center gap-6 pointer-events-none">
                    {/* Scroll Guide (Bouncing) */}
                    <div
                        className="text-center cursor-pointer opacity-80 hover:opacity-100 transition-opacity pointer-events-auto animate-bounce"
                        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                    >
                        <p className="text-sm text-white font-light mb-2 tracking-wide text-shadow-sm">Memit의 이야기가 더 궁금하신가요?</p>
                        <ChevronDown className="w-6 h-6 text-white mx-auto" />
                    </div>

                    {/* Footer Info (Static) */}
                    <p className="text-[10px] text-white/40 font-light tracking-wider pointer-events-auto">
                        © 2026 Memit Inc. <a className="hover:text-white transition-colors" href="#">Terms</a> • <a className="hover:text-white transition-colors" href="#">Privacy</a>
                    </p>
                </div>
            </div>

            {/* Vertical Storytelling Landing (Added) */}
            <div className="w-full shrink-0">
                <StorytellingLanding />
            </div>
        </div>
    );
}
