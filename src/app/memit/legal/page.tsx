'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, ChevronLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LEGAL_CONTENT = {
    privacy: {
        title: "개인정보 처리방침",
        icon: Shield,
        content: `
Memit(이하 '앱')은 사용자의 개인정보를 소중하게 생각합니다.

1. 수집하는 개인정보 항목
- 이메일 주소 (로그인 및 계정 관리)
- 기기 식별자 (푸시 알림 및 서비스 최적화)
- 앱 내 생성 콘텐츠 (기억 데이터 - 암호화되어 저장됨)

2. 개인정보의 이용 목적
- 회원 서비스 제공 및 본인 확인
- 서비스 개선 및 새로운 기능 개발
- 중요 공지사항 및 알림 전달

3. 데이터 보안
- 모든 기억 데이터와 민감 정보는 암호화되어 안전하게 보관됩니다.
- 사용자의 명시적인 공유 없이 제3자에게 데이터를 제공하지 않습니다.

4. 사용자의 권리
- 사용자는 언제든지 자신의 데이터를 열람, 수정하거나 계정 삭제를 요청할 수 있습니다.
        `
    },
    terms: {
        title: "이용약관",
        icon: FileText,
        content: `
본 약관은 Memit 서비스 사용에 관한 권리와 의무를 규정합니다.

1. 서비스의 목적
- Memit은 AI를 활용한 기억력 향상 및 암기 지원 도구를 제공합니다.

2. 사용자의 의무
- 사용자는 타인의 권리를 침해하거나 법에 저촉되는 내용을 기록해서는 안 됩니다.
- 계정 공유로 인한 보안 사고의 책임은 사용자에게 있습니다.

3. 책임의 한계
- Memit은 사용자가 기록한 정보의 유실에 대해 백업 기능을 제공하나, 예기치 못한 물리적 서버 오류에 대한 완전한 책임을 보장하지는 않습니다. (주기적인 데이터 내보내기 권장)

4. 서비스 변경 및 중단
- 원활한 서비스 운영을 위해 사전 공지 후 기능을 업데이트하거나 변경할 수 있습니다.
        `
    }
};

export default function LegalPage() {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState<'privacy' | 'terms'>('privacy');

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white p-4 md:p-8">
            {/* Header */}
            <header className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold font-display">법적 고지</h1>
            </header>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
                {(['privacy', 'terms'] as const).map((id) => (
                    <button
                        key={id}
                        onClick={() => setActiveSection(id)}
                        className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${activeSection === id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {React.createElement(LEGAL_CONTENT[id].icon, { className: "w-4 h-4" })}
                        <span className="font-medium">{LEGAL_CONTENT[id].title}</span>
                    </button>
                ))}
            </div>

            {/* Content Card */}
            <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex-1 overflow-y-auto"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/20 rounded-xl text-primary">
                        {React.createElement(LEGAL_CONTENT[activeSection].icon, { className: "w-6 h-6" })}
                    </div>
                    <h2 className="text-xl font-bold">{LEGAL_CONTENT[activeSection].title}</h2>
                </div>

                <div className="space-y-4 text-slate-300 leading-relaxed font-light">
                    {LEGAL_CONTENT[activeSection].content.split('\n').map((line, i) => (
                        <p key={i} className={line.match(/^\d\./) ? "text-white font-semibold mt-6 mb-2" : ""}>
                            {line}
                        </p>
                    ))}
                </div>
            </motion.div>

            {/* Footer Callout */}
            <div className="mt-8 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-between group cursor-pointer"
                onClick={() => router.push('/memit/settings')}>
                <div>
                    <h3 className="font-medium text-indigo-300 mb-1">궁금한 점이 있으신가요?</h3>
                    <p className="text-sm text-slate-400">설정 메뉴에서 문의하기를 이용해 주세요.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    );
}
