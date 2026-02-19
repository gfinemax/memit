import React from 'react';
import { Shield, Globe, Lock, Check } from 'lucide-react';

export type PasswordLevel = 'L1_PIN' | 'L2_WEB' | 'L3_MASTER';

interface PasswordLevelSelectorProps {
    selectedLevel: PasswordLevel | null;
    onSelect: (level: PasswordLevel) => void;
}

export default function PasswordLevelSelector({ selectedLevel, onSelect }: PasswordLevelSelectorProps) {
    const levels = [
        {
            id: 'L1_PIN' as PasswordLevel,
            title: 'Lv.1 핀번호',
            icon: <Lock className="w-5 h-5 text-emerald-400" />,
            desc: '4자리 숫자 (이미지 2개)',
            example: '1234 (고래+대문)',
            color: 'border-emerald-500/30 bg-emerald-500/5'
        },
        {
            id: 'L2_WEB' as PasswordLevel,
            title: 'Lv.2 웹사이트',
            icon: <Globe className="w-5 h-5 text-blue-400" />,
            desc: '영문 + 6자리 숫자',
            example: 'Naver1234!',
            color: 'border-blue-500/30 bg-blue-500/5'
        },
        {
            id: 'L3_MASTER' as PasswordLevel,
            title: 'Lv.3 마스터',
            icon: <Shield className="w-5 h-5 text-purple-400" />,
            desc: '대소문자 + 8자리 + 특수문자',
            example: 'GoOgLe@1234',
            color: 'border-purple-500/30 bg-purple-500/5'
        }
    ];

    return (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-bold text-white mb-4">보안 등급을 선택하세요</h3>
            {levels.map((level) => {
                const isSelected = selectedLevel === level.id;
                return (
                    <button
                        key={level.id}
                        onClick={() => onSelect(level.id)}
                        className={`
                            w-full p-4 rounded-2xl border transition-all duration-200 relative group overflow-hidden text-left
                            ${isSelected
                                ? `border-white/40 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]`
                                : `${level.color} border-white/5 hover:border-white/20 hover:bg-white/10`
                            }
                        `}
                    >
                        <div className="flex items-start gap-4 relative z-10">
                            <div className={`
                                p-3 rounded-xl bg-slate-900/50 backdrop-blur-sm border border-white/10
                                ${isSelected ? 'scale-110' : 'scale-100'} transition-transform duration-300
                            `}>
                                {level.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className={`text-base font-bold mb-1 transition-colors ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                    {level.title}
                                </h4>
                                <p className="text-xs text-slate-400 font-medium mb-1.5">{level.desc}</p>
                                <div className="text-[10px] text-slate-500 font-mono bg-black/20 inline-block px-1.5 py-0.5 rounded">
                                    예: {level.example}
                                </div>
                            </div>
                            {isSelected && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 animate-in zoom-in duration-300">
                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                                        <Check className="w-3.5 h-3.5 text-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
