'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, User, Bell, Lock, HelpCircle, LogOut,
    ChevronRight, Moon, Shield, Mail, Info, FileText
} from 'lucide-react';

export default function SettingsPage() {
    const router = useRouter();
    const [darkMode, setDarkMode] = useState<'system' | 'dark' | 'light'>('system');

    return (
        <>
            {/* ─── Desktop View ─── */}
            <div className="hidden md:block p-6 lg:p-10">
                <div className="max-w-3xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-white font-display">설정</h1>
                        <p className="text-slate-400 mt-1">계정, 앱 환경, 지원 옵션을 관리하세요.</p>
                    </div>

                    {/* Profile Card */}
                    <div className="flex items-center gap-5 p-6 bg-[#1e1c30] rounded-2xl border border-slate-800 mb-10 group hover:border-primary/30 transition-all">
                        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-3xl shrink-0 ring-2 ring-slate-700 group-hover:ring-primary/40 transition-all">
                            🐶
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold text-white">게스트 사용자</h2>
                            <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <Mail className="w-3.5 h-3.5" />
                                guest@memit.com (Demo)
                            </p>
                        </div>
                        <button className="px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-colors">
                            편집
                        </button>
                    </div>

                    {/* ─── 계정 Section ─── */}
                    <SettingsSection title="계정">
                        <SettingItem icon={User} title="개인 정보" description="이름, 이메일, 프로필 이미지 변경" />
                        <SettingItem icon={Lock} title="비밀번호 및 보안" description="비밀번호 변경, 2단계 인증" />
                        <SettingItem icon={Bell} title="알림 설정" description="푸시 알림, 이메일 알림 관리" isLast />
                    </SettingsSection>

                    {/* ─── 앱 설정 Section ─── */}
                    <SettingsSection title="앱 설정">
                        <SettingItem
                            icon={Moon}
                            title="다크 모드"
                            description="화면 테마를 설정합니다"
                            value={darkMode === 'system' ? '시스템 설정' : darkMode === 'dark' ? '다크' : '라이트'}
                        />
                        <SettingItem icon={Shield} title="프라이버시" description="데이터 수집, 개인정보 관리" isLast />
                    </SettingsSection>

                    {/* ─── 지원 Section ─── */}
                    <SettingsSection title="지원">
                        <SettingItem icon={HelpCircle} title="도움말 및 지원" description="FAQ, 문의하기" />
                        <SettingItem icon={FileText} title="이용 약관" description="서비스 이용약관 및 정책" />
                        <SettingItem icon={Info} title="앱 정보" description="MEMIT v1.0.0" />
                        <SettingItem icon={LogOut} title="로그아웃" isDanger isLast />
                    </SettingsSection>
                </div>
            </div>

            {/* ─── Mobile View ─── */}
            <div className="block md:hidden bg-background-dark min-h-screen flex flex-col text-white pb-24">
                {/* Mobile Header */}
                <header className="px-4 py-4 sticky top-0 bg-background-dark/95 backdrop-blur-sm z-10 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 rounded-full hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold">설정</h1>
                </header>

                <main className="px-4 py-2 space-y-6">
                    {/* Mobile Profile */}
                    <div className="flex items-center gap-4 p-4 bg-[#1e1c30] rounded-2xl">
                        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-2xl">
                            🐶
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold">게스트 사용자</h2>
                            <p className="text-xs text-slate-500">guest@memit.com (Demo)</p>
                        </div>
                        <button className="text-primary text-sm font-medium">편집</button>
                    </div>

                    {/* Mobile Setting Groups */}
                    <MobileSettingsSection title="계정">
                        <MobileSettingItem icon={User} title="개인 정보" />
                        <MobileSettingItem icon={Lock} title="비밀번호 및 보안" />
                        <MobileSettingItem icon={Bell} title="알림 설정" isLast />
                    </MobileSettingsSection>

                    <MobileSettingsSection title="앱 설정">
                        <MobileSettingItem icon={Moon} title="다크 모드" value="시스템 설정" />
                        <MobileSettingItem icon={Shield} title="프라이버시" isLast />
                    </MobileSettingsSection>

                    <MobileSettingsSection title="지원">
                        <MobileSettingItem icon={HelpCircle} title="도움말 및 지원" />
                        <MobileSettingItem icon={LogOut} title="로그아웃" isLast isDanger />
                    </MobileSettingsSection>
                </main>
            </div>
        </>
    );
}

/* ─── Desktop Components ─── */

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-8">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest px-1 mb-3">{title}</h3>
            <div className="bg-[#1e1c30] rounded-2xl border border-slate-800 overflow-hidden">
                {children}
            </div>
        </div>
    );
}

function SettingItem({
    icon: Icon, title, description, value, isLast, isDanger
}: {
    icon: any; title: string; description?: string; value?: string; isLast?: boolean; isDanger?: boolean;
}) {
    return (
        <div className={`flex items-center p-5 hover:bg-slate-800/40 transition-colors cursor-pointer group
            ${!isLast ? 'border-b border-slate-800/60' : ''}`}
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-colors
                ${isDanger
                    ? 'bg-red-500/10 text-red-400 group-hover:bg-red-500/20'
                    : 'bg-slate-800 text-slate-300 group-hover:bg-primary/20 group-hover:text-primary'
                }`}
            >
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <span className={`font-semibold block ${isDanger ? 'text-red-400' : 'text-slate-200 group-hover:text-white'}`}>
                    {title}
                </span>
                {description && (
                    <span className="text-xs text-slate-500 block mt-0.5">{description}</span>
                )}
            </div>
            {value && <span className="text-sm text-slate-400 mr-3 shrink-0">{value}</span>}
            {!isDanger && <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />}
        </div>
    );
}

/* ─── Mobile Components ─── */

function MobileSettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-500 px-1">{title}</h3>
            <div className="bg-[#1e1c30] rounded-2xl overflow-hidden">{children}</div>
        </div>
    );
}

function MobileSettingItem({
    icon: Icon, title, value, isLast, isDanger
}: {
    icon: any; title: string; value?: string; isLast?: boolean; isDanger?: boolean;
}) {
    return (
        <div className={`flex items-center p-4 hover:bg-slate-800/50 transition-colors cursor-pointer
            ${!isLast ? 'border-b border-slate-800' : ''}`}
        >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3
                ${isDanger ? 'bg-red-900/20 text-red-500' : 'bg-slate-800 text-slate-300'}`}
            >
                <Icon className="w-4 h-4" />
            </div>
            <span className={`flex-1 font-medium ${isDanger ? 'text-red-500' : 'text-slate-200'}`}>{title}</span>
            {value && <span className="text-sm text-slate-400 mr-2">{value}</span>}
            {!isDanger && <ChevronRight className="w-4 h-4 text-slate-400" />}
        </div>
    );
}
