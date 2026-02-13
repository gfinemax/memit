'use client';

import React from 'react';
import { Key, HelpCircle } from 'lucide-react';

export default function MnemonicKey({ activeNumber, isExpanded }: { activeNumber?: string, isExpanded?: boolean }) {
    const mnemonics = [
        { num: '0', sound: 'ㅇ', word: '알', consonants: '이응(ㅇ)' },
        { num: '1', sound: 'ㄱ,ㅋ', word: '감', consonants: '기역,키읔' },
        { num: '2', sound: 'ㄴ,ㄹ', word: '논', consonants: '니은,리을' },
        { num: '3', sound: 'ㄷ,ㅌ', word: '달', consonants: '디귿,티읕' },
        { num: '4', sound: 'ㅁ,ㅂ', word: '물', consonants: '미음,비읍' },
        { num: '5', sound: 'ㅅ', word: '산', consonants: '시옷' },
        { num: '6', sound: 'ㅈ', word: '종', consonants: '지읒' },
        { num: '7', sound: 'ㅊ', word: '차', consonants: '치읓' },
        { num: '8', sound: 'ㅍ', word: '파', consonants: '피읍' },
        { num: '9', sound: 'ㅎ', word: '해', consonants: '히읗' },
    ];

    return (
        <section className={`transition-all duration-300 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none absolute bottom-0 left-0 right-0 z-[-1]'}`}>
            <div className="glass-panel p-6 rounded-3xl border border-[#8B5CF6]/30 bg-slate-900/80 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
                            <Key className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-white font-display">
                            기억의 열쇠 <span className="text-slate-500 font-normal text-sm ml-1 font-sans">Mnemonic Key</span>
                        </h3>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3">
                    {mnemonics.map((item) => {
                        const isActive = activeNumber?.includes(item.num);
                        return (
                            <div
                                key={item.num}
                                className={`
                                    border p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 shadow-sm group
                                    ${isActive
                                        ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] scale-105 shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                                        : 'bg-slate-800/40 border-[#8B5CF6]/20 hover:border-[#8B5CF6]/60 hover:bg-[#8B5CF6]/10'
                                    }
                                `}
                            >
                                <span className={`text-xs font-bold leading-none mb-1 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                    {item.num}
                                </span>
                                <div className={`
                                    w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
                                    ${isActive ? 'bg-[#8B5CF6] text-white shadow-lg' : 'bg-slate-900/80 border border-slate-700 text-[#8B5CF6]'}
                                `}>
                                    <span className="text-lg font-bold leading-none tracking-tight">
                                        {item.sound.replace(/,/g, '')}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <p className={`text-[10px] font-medium transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{item.word}</p>
                                    <p className={`text-[10px] transition-colors ${isActive ? 'text-[#8B5CF6] font-bold' : 'text-slate-500 group-hover:text-amber-200'}`}>{item.consonants.split('(')[0]}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <p className="text-[10px] text-slate-500 mt-4 text-center">
                    입력한 숫자에 해당하는 자음이 하이라이트됩니다.
                </p>
            </div>
        </section>
    );
}
