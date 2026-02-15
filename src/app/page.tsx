'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';


export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // 1. Auth Hash/Code Check (Forwarding)
    const hash = window.location.hash;
    if (hash && (hash.includes('access_token') || hash.includes('error'))) {
      router.replace(`/auth/callback${hash}`);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      router.replace(`/auth/callback${window.location.search}`);
      return;
    }

    // 2. Intelligent Redirection
    const checkMobileSession = async () => {
      if (Capacitor.isNativePlatform()) {
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();

        if (!supabase) {
          router.replace('/login');
          return;
        }

        const { data } = await supabase.auth.getSession();
        if (data.session) {
          router.replace('/memit');
        } else {
          router.replace('/login');
        }
      }
    };

    checkMobileSession();
  }, [router]);

  return (
    <main className="bg-[#0f172a] min-h-screen text-white selection:bg-primary/30 antialiased overflow-x-hidden">
      <LandingHeader />
      <HeroSection />

      {/* Feature List Section (Multi-Module Persona) */}
      <section id="features" className="py-32 px-6 relative z-20 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
            두뇌를 업그레이드하는 <br className="hidden md:block" />
            <span className="text-indigo-400">3가지 생각 도구</span>
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Persona 1: Security Officer */}
          <div className="p-8 rounded-3xl bg-indigo-900/10 border border-indigo-500/20 hover:bg-indigo-900/20 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform relative z-10">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white relative z-10">보안 전문가 (Security)</h3>
            <p className="text-indigo-200 text-sm font-semibold mb-4 relative z-10 tracking-wide uppercase text-[10px]">Password Generator</p>
            <p className="text-slate-400 leading-relaxed font-light text-sm relative z-10">
              "비밀번호, 외우지 말고 만드세요."<br />
              당신만의 해킹 불가능한 마스터키 로직을 설계해 드립니다.
            </p>
          </div>

          {/* Persona 2: Brain Coach */}
          <div className="p-8 rounded-3xl bg-emerald-900/10 border border-emerald-500/20 hover:bg-emerald-900/20 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform relative z-10">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white relative z-10">두뇌 트레이너 (Brain)</h3>
            <p className="text-emerald-200 text-sm font-semibold mb-4 relative z-10 tracking-wide uppercase text-[10px]">Number Training</p>
            <p className="text-slate-400 leading-relaxed font-light text-sm relative z-10">
              "죽어있는 숫자를 살아있는 이미지로."<br />
              잠든 좌뇌와 우뇌를 동시에 깨우는 고강도 두뇌 트레이닝.
            </p>
          </div>

          {/* Persona 3: Stage Director */}
          <div className="p-8 rounded-3xl bg-purple-900/10 border border-purple-500/20 hover:bg-purple-900/20 transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform relative z-10">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white relative z-10">카리스마 코치 (Speech)</h3>
            <p className="text-purple-200 text-sm font-semibold mb-4 relative z-10 tracking-wide uppercase text-[10px]">Presentation Master</p>
            <p className="text-slate-400 leading-relaxed font-light text-sm relative z-10">
              "원고 없이 무대에 서는 자유."<br />
              당신의 이야기가 청중의 기억 속에 영원히 남도록 만듭니다.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 px-6 relative z-20 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-slate-500 text-sm font-light">
            © 2026 MEMIT AI. Built for the dreamers.
          </div>
          <div className="flex gap-8 text-slate-400 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
