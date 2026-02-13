'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Bell, Lock, HelpCircle, LogOut, ChevronRight, Moon, Shield } from 'lucide-react';

export default function SettingsPage() {
    const router = useRouter();

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col text-slate-900 dark:text-white pb-24">
            {/* Header */}
            <header className="px-4 py-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm z-10 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">설정</h1>
            </header>

            <main className="px-4 py-2 space-y-6">
                {/* Profile Section */}
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-[#1e1c30] rounded-2xl shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl">
                        🐶
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold">게스트 사용자</h2>
                        <p className="text-xs text-slate-500">guest@memit.com (Demo)</p>
                    </div>
                    <button className="text-primary text-sm font-medium">편집</button>
                </div>

                {/* Settings Groups */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 px-1">계정</h3>
                    <div className="bg-white dark:bg-[#1e1c30] rounded-2xl overflow-hidden shadow-sm">
                        <SettingItem icon={User} title="개인 정보" />
                        <SettingItem icon={Lock} title="비밀번호 및 보안" />
                        <SettingItem icon={Bell} title="알림 설정" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 px-1">앱 설정</h3>
                    <div className="bg-white dark:bg-[#1e1c30] rounded-2xl overflow-hidden shadow-sm">
                        <SettingItem icon={Moon} title="다크 모드" value="시스템 설정" />
                        <SettingItem icon={Shield} title="프라이버시" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 px-1">지원</h3>
                    <div className="bg-white dark:bg-[#1e1c30] rounded-2xl overflow-hidden shadow-sm">
                        <SettingItem icon={HelpCircle} title="도움말 및 지원" />
                        <SettingItem icon={LogOut} title="로그아웃" isLast isDanger />
                    </div>
                </div>
            </main>
        </div>
    );
}

function SettingItem({ icon: Icon, title, value, isLast, isDanger }: { icon: any, title: string, value?: string, isLast?: boolean, isDanger?: boolean }) {
    return (
        <div className={`flex items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!isLast ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${isDanger ? 'bg-red-100 text-red-500 dark:bg-red-900/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                <Icon className="w-4 h-4" />
            </div>
            <span className={`flex-1 font-medium ${isDanger ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>{title}</span>
            {value && <span className="text-sm text-slate-400 mr-2">{value}</span>}
            {!isDanger && <ChevronRight className="w-4 h-4 text-slate-400" />}
        </div>
    );
}
