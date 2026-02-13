'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreHorizontal, Shield, CreditCard, LayoutGrid, KeyRound, Eye, X } from 'lucide-react';

export default function SecurityPage() {
    const router = useRouter();
    const [inputValue, setInputValue] = useState('4812 9012');
    const [inputType, setInputType] = useState<'card' | 'pin' | 'password'>('card');

    const handleKeypadClick = (key: string) => {
        if (key === 'backspace') {
            setInputValue(prev => prev.slice(0, -1));
        } else if (key === 'done') {
            // Handle done action
            console.log('Done:', inputValue);
        } else {
            setInputValue(prev => prev + key);
        }
    };

    return (
        <>
            {/* ─── Desktop View ─── */}
            <div className="hidden md:block p-6 lg:p-10 min-h-full">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <span className="text-primary font-semibold text-xs uppercase tracking-wider">MEMIT SECURITY</span>
                        <h1 className="text-3xl font-bold text-white font-display mt-1">보안 & 금융</h1>
                        <p className="text-slate-400 mt-1">민감한 정보를 강력한 기억 스토리로 변환하여 안전하게 보관하세요.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left: Input & Keypad */}
                        <div className="lg:col-span-6 space-y-6">
                            <div className="bg-[#1e1c30] rounded-2xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
                                {/* Type Selector */}
                                <div className="mb-8">
                                    <div className="bg-slate-800/50 p-1 rounded-xl flex items-center relative">
                                        {(['card', 'pin', 'password'] as const).map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setInputType(type)}
                                                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 z-10 ${inputType === type ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-200'}`}
                                            >
                                                {type === 'card' && <CreditCard className="w-4 h-4" />}
                                                {type === 'pin' && <LayoutGrid className="w-4 h-4" />}
                                                {type === 'password' && <KeyRound className="w-4 h-4" />}
                                                {type === 'card' ? '카드 번호' : type === 'pin' ? 'PIN 번호' : '비밀번호'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Input Area */}
                                <div className="text-center mb-10">
                                    <label className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4 block">Secure Entry</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full bg-transparent border-b-2 border-slate-800 focus:border-primary text-center text-4xl font-bold py-6 px-4 placeholder:text-slate-800 focus:ring-0 transition-colors tracking-widest text-white outline-none"
                                            placeholder="0000 0000 0000 0000"
                                            value={inputValue}
                                            readOnly
                                        />
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-3">
                                            <button className="text-slate-600 hover:text-primary transition-colors">
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => setInputValue('')} className="text-slate-600 hover:text-red-500 transition-colors">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Keypad */}
                                <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => handleKeypadClick(num.toString())}
                                            className="h-16 rounded-xl text-2xl font-bold text-white bg-slate-800/40 border border-slate-800 hover:bg-primary/20 hover:border-primary/30 transition-all flex items-center justify-center"
                                        >
                                            {num}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handleKeypadClick('backspace')}
                                        className="h-16 rounded-xl flex items-center justify-center bg-slate-800/40 border border-slate-800 hover:bg-slate-700 transition-all text-slate-400"
                                    >
                                        <DeleteIcon className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => handleKeypadClick('0')}
                                        className="h-16 rounded-xl text-2xl font-bold text-white bg-slate-800/40 border border-slate-800 hover:bg-primary/20 hover:border-primary/30 transition-all flex items-center justify-center"
                                    >
                                        0
                                    </button>
                                    <button
                                        onClick={() => handleKeypadClick('done')}
                                        className="h-16 rounded-xl flex items-center justify-center bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                    >
                                        확인
                                    </button>
                                </div>
                            </div>

                            <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 group">
                                <LockIcon className="w-6 h-6 group-hover:animate-bounce" />
                                <span className="text-lg">보안 메밋하기</span>
                            </button>
                        </div>

                        {/* Right: Info & Stats */}
                        <div className="lg:col-span-6 space-y-8">
                            <div className="bg-[#1e1c30] rounded-2xl p-8 border border-slate-800">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 border border-primary/20">
                                        <Shield className="w-10 h-10 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">강력한 암호화 알고리즘</h3>
                                        <p className="text-sm text-slate-400">데이터는 AES-256 방식으로 암호화되어 안전하게 보관됩니다.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-4 transition-colors hover:border-primary/30 group">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary group-hover:scale-110 transition-transform">
                                            <ZapIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">보안 메모리 스토리 전환</h4>
                                            <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors">숫자 열을 의미 있는 이야기로 시각화하여 기억률을 10배 이상 높입니다.</p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-4 transition-colors hover:border-primary/30 group">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary group-hover:scale-110 transition-transform">
                                            <LockIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">오프라인 우선 저장</h4>
                                            <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors">네트워크가 없어도 암호화된 상태로 안전하게 접근할 수 있습니다.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-600/5 border border-primary/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <KeyRound className="w-20 h-20" />
                                </div>
                                <h3 className="text-lg font-bold text-primary mb-2 italic">Remember this?</h3>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    "당신의 카드 비밀번호는 이제 더 이상 단순한 숫자가 아닙니다. 숲속을 달리는 파란색 사자와 같은 강렬한 이미지로 기억될 것입니다."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Mobile View ─── */}
            <div className="block md:hidden bg-background-dark min-h-screen flex flex-col relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] rounded-full bg-primary/20 blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] rounded-full bg-primary/10 blur-[80px] pointer-events-none"></div>

                {/* Header */}
                <header className="flex items-center justify-between px-6 py-5 z-20">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-300" />
                    </button>
                    <h1 className="text-lg font-bold tracking-tight text-center flex-1 text-white">보안 & 금융</h1>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                        <MoreHorizontal className="w-6 h-6 text-slate-300" />
                    </button>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex flex-col px-6 pt-4 pb-8 z-10 overflow-y-auto no-scrollbar">
                    {/* Trust Visual */}
                    <div className="flex flex-col items-center justify-center mb-10 mt-4 relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-75 animate-pulse"></div>
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-white/10 z-10 relative">
                            <Shield className="w-12 h-12 text-primary" />
                            <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                        </div>
                        <p className="mt-4 text-sm font-medium text-slate-400 flex items-center gap-1.5">
                            <LockIcon className="w-4 h-4" />
                            256-bit Secure Encryption
                        </p>
                    </div>

                    {/* Type Selector */}
                    <div className="mb-8">
                        <div className="bg-slate-800/50 p-1.5 rounded-xl flex items-center relative">
                            <button
                                onClick={() => setInputType('card')}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm flex items-center justify-center gap-2 ${inputType === 'card' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                <CreditCard className="w-4 h-4" />
                                카드 번호
                            </button>
                            <button
                                onClick={() => setInputType('pin')}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${inputType === 'pin' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                                PIN 번호
                            </button>
                            <button
                                onClick={() => setInputType('password')}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${inputType === 'password' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                <KeyRound className="w-4 h-4" />
                                비밀번호
                            </button>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="flex flex-col items-center mb-8 relative">
                        <label className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Number Entry</label>
                        <div className="relative w-full">
                            <input
                                type="text"
                                className="w-full bg-transparent border-b-2 border-slate-700 focus:border-primary text-center text-3xl sm:text-4xl font-bold py-4 px-2 placeholder-slate-700 focus:ring-0 transition-colors tracking-wider font-display text-white outline-none"
                                placeholder="0000 0000 0000 0000"
                                value={inputValue}
                                readOnly
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                                <button className="text-slate-400 hover:text-primary transition-colors">
                                    <Eye className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setInputValue('')}
                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/50 mx-auto"></div>
                    </div>

                    {/* Description */}
                    <div className="mt-auto mb-8 bg-white/5 rounded-2xl p-5 border border-white/5">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <ZapIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base mb-1 text-white">보안 메모리 변환</h3>
                                <p className="text-sm text-slate-400 leading-relaxed word-keep-all">
                                    민감한 정보를 강력한 기억 스토리로 변환합니다. 외우기 힘든 숫자들을 안전하게 기억하세요.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Custom Numeric Keypad */}
                <div className="bg-[#1a1a2e] pb-6 pt-2 rounded-t-3xl border-t border-white/5 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-20">
                    {/* Action Button */}
                    <div className="px-6 -mt-8 mb-4">
                        <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                            <LockIcon className="w-5 h-5 group-hover:animate-pulse" />
                            보안 메밋하기
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-y-4 px-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <button
                                key={num}
                                onClick={() => handleKeypadClick(num.toString())}
                                className="h-14 rounded-lg text-2xl font-medium text-white hover:bg-white/5 transition-colors active:scale-95"
                            >
                                {num}
                            </button>
                        ))}
                        <button
                            onClick={() => handleKeypadClick('backspace')}
                            className="h-14 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors active:scale-95 text-slate-500"
                        >
                            <DeleteIcon className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => handleKeypadClick('0')}
                            className="h-14 rounded-lg text-2xl font-medium text-white hover:bg-white/5 transition-colors active:scale-95"
                        >
                            0
                        </button>
                        <button
                            onClick={() => handleKeypadClick('done')}
                            className="h-14 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors active:scale-95 text-primary font-bold text-sm"
                        >
                            Done
                        </button>
                    </div>
                    {/* Home Indicator Spacer */}
                    <div className="h-2 w-32 bg-slate-700 rounded-full mx-auto mt-4"></div>
                </div>
            </div>
        </>
    );
}

// Icon helpers
function LockIcon({ className }: { className?: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
}

function ZapIcon({ className }: { className?: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
}

function DeleteIcon({ className }: { className?: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" /><line x1="18" x2="12" y1="9" y2="15" /><line x1="12" x2="18" y1="9" y2="15" /></svg>;
}
