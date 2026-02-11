'use client';

import React from 'react';
import { Key, HelpCircle } from 'lucide-react';

export default function MnemonicKey() {
    const mnemonics = [
        { num: '0', sound: 'ㅇ', word: '동그라미', consonants: '이응(ㅇ)' },
        { num: '1', sound: 'ㄱ,ㅋ', word: '가나다', consonants: '기역,키읔' },
        { num: '2', sound: 'ㄴ,ㄹ', word: '나르다', consonants: '니은,리을' },
        { num: '3', sound: 'ㄷ,ㅌ', word: '다트', consonants: '디귿,티읕' },
        { num: '4', sound: 'ㅁ,ㅂ', word: '마법', consonants: '미음,비읍' },
        { num: '5', sound: 'ㅅ', word: '산', consonants: '시옷' },
        { num: '6', sound: 'ㅈ', word: '자동차', consonants: '지읒' },
        { num: '7', sound: 'ㅊ', word: '칠보', consonants: '치읓' },
        { num: '8', sound: 'ㅍ', word: '팔', consonants: '피읍' },
        { num: '9', sound: 'ㅎ', word: '하늘', consonants: '히읗' },
    ];

    return (
        <section className="glass-panel p-6 rounded-3xl h-full border border-[#8B5CF6]/30">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
                        <Key className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-white font-display">
                        기억의 열쇠 <span className="text-slate-500 font-normal text-sm ml-1 font-sans">Mnemonic Key</span>
                    </h3>
                </div>
                <button className="text-slate-500 hover:text-[#8B5CF6] transition-colors">
                    <HelpCircle className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {mnemonics.map((item) => (
                    <div key={item.num} className="bg-slate-800/40 border border-[#8B5CF6]/20 p-3 rounded-2xl flex items-center gap-3 hover:border-[#8B5CF6]/60 hover:bg-[#8B5CF6]/10 transition-all duration-300 hover:-translate-y-0.5 shadow-sm group">
                        <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700 flex flex-col items-center justify-center shrink-0 group-hover:border-[#8B5CF6]/50 transition-colors">
                            <span className="text-xs font-bold text-[#8B5CF6] leading-none">{item.num}</span>
                            <span className="text-lg font-bold text-white leading-none mt-0.5">{item.sound}</span>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-medium group-hover:text-slate-300 transition-colors">{item.word}</p>
                            <p className="text-xs text-slate-300 group-hover:text-white transition-colors">{item.consonants}</p>
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-[10px] text-slate-500 mt-4 text-center">
                기본 원칙(Basic Principles)을 학습하며 입력해보세요.
            </p>
        </section>
    );
}
