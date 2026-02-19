'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, User, Bell, Lock, HelpCircle, LogOut,
    ChevronRight, Moon, Shield, Mail, Info, FileText, X, Check
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';

export default function SettingsPage() {
    const router = useRouter();
    const [darkMode, setDarkMode] = useState<'system' | 'dark' | 'light'>('system');
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [editName, setEditName] = useState('');
    const [saving, setSaving] = useState(false);
    const [biometricsAvailable, setBiometricsAvailable] = useState(false);
    const [biometricEnabled, setBiometricEnabled] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        if (!supabase) return;

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
                supabase.from('profiles').select('*').eq('id', session.user.id).single()
                    .then(({ data }) => { if (data) setProfile(data); });
            }
        });

        // Check Biometrics Availability
        NativeBiometric.isAvailable()
            .then((result) => setBiometricsAvailable(result.isAvailable))
            .catch(() => setBiometricsAvailable(false));

        const enabled = localStorage.getItem('biometric_enabled') === 'true';
        setBiometricEnabled(enabled);
    }, []);

    const handleToggleBiometric = async () => {
        const nextValue = !biometricEnabled;
        if (nextValue) {
            try {
                // Verify before enabling
                await NativeBiometric.verifyIdentity({
                    reason: "생체 인식을 활성화하기 위해 인증이 필요합니다.",
                    title: "본인 인증",
                    subtitle: "생체 인식을 사용하여 잠금을 설정합니다.",
                    description: "기기에서 지원하는 생체 인식 정보를 사용합니다.",
                    negativeButtonText: "취소",
                });
                setBiometricEnabled(true);
                localStorage.setItem('biometric_enabled', 'true');
            } catch (e) {
                console.error('Biometric verification failed', e);
                // On some devices, cancel might throw an error
            }
        } else {
            setBiometricEnabled(false);
            localStorage.setItem('biometric_enabled', 'false');
        }
    };

    const displayName = profile?.username ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split('@')[0] || '게스트 사용자';
    const displayEmail = user?.email || 'guest@memit.com (Demo)';
    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

    const handleSaveName = async () => {
        const supabase = createClient();
        if (!supabase || !user) return;
        setSaving(true);
        try {
            await supabase.from('profiles').upsert({
                id: user.id,
                username: editName,
                updated_at: new Date().toISOString(),
            });
            setProfile((prev: any) => ({ ...prev, username: editName }));
            setEditOpen(false);
        } catch (e) {
            console.error('Profile update failed', e);
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = async () => {
        const supabase = createClient();
        if (supabase) {
            await supabase.auth.signOut();
            window.location.href = '/login';
        }
    };

    const openEdit = () => {
        setEditName(displayName);
        setEditOpen(true);
    };

    return (
        <>
            {/* Edit Modal */}
            {editOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 z-[60]" onClick={() => setEditOpen(false)}></div>
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white">프로필 편집</h3>
                                <button onClick={() => setEditOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-3xl shrink-0 overflow-hidden ring-2 ring-primary/40">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{displayName.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-400 truncate">{displayEmail}</p>
                                </div>
                            </div>
                            <div className="space-y-2 mb-6">
                                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">표시 이름</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="표시할 이름을 입력하세요"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setEditOpen(false)}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                >취소</button>
                                <button
                                    onClick={handleSaveName}
                                    disabled={saving || !editName.trim()}
                                    className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary/80 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {saving ? '저장 중...' : <><Check className="w-4 h-4" /> 저장</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ─── Desktop View ─── */}
            <div className="hidden md:block p-6 lg:p-10">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-white font-display">설정</h1>
                        <p className="text-slate-400 mt-1">계정, 앱 환경, 지원 옵션을 관리하세요.</p>
                    </div>

                    {/* Profile Card */}
                    <div className="flex items-center gap-5 p-6 bg-[#1e1c30] rounded-2xl border border-slate-800 mb-10 group hover:border-primary/30 transition-all">
                        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-3xl shrink-0 ring-2 ring-slate-700 group-hover:ring-primary/40 transition-all overflow-hidden">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span>{displayName.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold text-white">{displayName}</h2>
                            <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <Mail className="w-3.5 h-3.5" />
                                {displayEmail}
                            </p>
                        </div>
                        <button onClick={openEdit} className="px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-colors">
                            편집
                        </button>
                    </div>

                    <SettingsSection title="계정">
                        <SettingItem icon={User} title="개인 정보" description="이름, 이메일, 프로필 이미지 변경" onClick={openEdit} />
                        <SettingItem icon={Lock} title="비밀번호 및 보안" description="비밀번호 변경, 2단계 인증" />
                        <SettingItem icon={Bell} title="알림 설정" description="푸시 알림, 이메일 알림 관리" isLast />
                    </SettingsSection>

                    <SettingsSection title="앱 설정">
                        <SettingItem icon={Moon} title="다크 모드" description="화면 테마를 설정합니다"
                            value={darkMode === 'system' ? '시스템 설정' : darkMode === 'dark' ? '다크' : '라이트'} />
                        {biometricsAvailable && (
                            <SettingToggle
                                icon={Shield}
                                title="생체 파일 잠금"
                                description="보안 카테고리 진입 시 생체 인증 필요"
                                enabled={biometricEnabled}
                                onToggle={handleToggleBiometric}
                            />
                        )}
                        <SettingItem icon={Shield} title="프라이버시" description="데이터 수집, 개인정보 관리" isLast />
                    </SettingsSection>

                    <SettingsSection title="지원">
                        <SettingItem icon={HelpCircle} title="도움말 및 지원" description="FAQ, 문의하기" />
                        <SettingItem icon={FileText} title="이용 약관 및 정책" description="개인정보 처리방침, 서비스 이용약관" onClick={() => router.push('/memit/legal')} />
                        <SettingItem icon={Info} title="앱 정보" description="MEMIT v1.1.0" />
                        <SettingItem icon={LogOut} title="로그아웃" isDanger isLast onClick={handleSignOut} />
                    </SettingsSection>
                </div>
            </div>

            {/* ─── Mobile View ─── */}
            <div className="block md:hidden bg-background-dark min-h-screen flex flex-col text-white pb-24">
                <header className="px-4 py-4 sticky top-0 bg-background-dark/95 backdrop-blur-sm z-10 flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-slate-800 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold">설정</h1>
                </header>

                <main className="px-4 py-2 space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-[#1e1c30] rounded-2xl">
                        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-2xl overflow-hidden">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span>{displayName.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold">{displayName}</h2>
                            <p className="text-xs text-slate-500">{displayEmail}</p>
                        </div>
                        <button onClick={openEdit} className="text-primary text-sm font-medium">편집</button>
                    </div>

                    <MobileSettingsSection title="계정">
                        <MobileSettingItem icon={User} title="개인 정보" onClick={openEdit} />
                        <MobileSettingItem icon={Lock} title="비밀번호 및 보안" />
                        <MobileSettingItem icon={Bell} title="알림 설정" isLast />
                    </MobileSettingsSection>

                    <MobileSettingsSection title="앱 설정">
                        <MobileSettingItem icon={Moon} title="다크 모드" value="시스템 설정" />
                        {biometricsAvailable && (
                            <MobileSettingToggle
                                icon={Shield}
                                title="생체 파일 잠금"
                                enabled={biometricEnabled}
                                onToggle={handleToggleBiometric}
                            />
                        )}
                        <MobileSettingItem icon={Shield} title="프라이버시" isLast />
                    </MobileSettingsSection>

                    <MobileSettingsSection title="지원">
                        <MobileSettingItem icon={HelpCircle} title="도움말 및 지원" />
                        <MobileSettingItem icon={FileText} title="이용 약관 및 정책" onClick={() => router.push('/memit/legal')} />
                        <MobileSettingItem icon={Info} title="앱 정보" value="v1.1.0" />
                        <MobileSettingItem icon={LogOut} title="로그아웃" isLast isDanger onClick={handleSignOut} />
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
    icon: Icon, title, description, value, isLast, isDanger, onClick
}: {
    icon: any; title: string; description?: string; value?: string; isLast?: boolean; isDanger?: boolean; onClick?: () => void;
}) {
    return (
        <div onClick={onClick} className={`flex items-center p-5 hover:bg-slate-800/40 transition-colors cursor-pointer group
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

function SettingToggle({
    icon: Icon, title, description, enabled, isLast, onToggle
}: {
    icon: any; title: string; description?: string; enabled: boolean; isLast?: boolean; onToggle: () => void;
}) {
    return (
        <div onClick={onToggle} className={`flex items-center p-5 hover:bg-slate-800/40 transition-colors cursor-pointer group
            ${!isLast ? 'border-b border-slate-800/60' : ''}`}
        >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-4 bg-slate-800 text-slate-300 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <span className="font-semibold block text-slate-200 group-hover:text-white">
                    {title}
                </span>
                {description && (
                    <span className="text-xs text-slate-500 block mt-0.5">{description}</span>
                )}
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-primary' : 'bg-slate-700'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'left-7' : 'left-1'}`} />
            </div>
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
    icon: Icon, title, value, isLast, isDanger, onClick
}: {
    icon: any; title: string; value?: string; isLast?: boolean; isDanger?: boolean; onClick?: () => void;
}) {
    return (
        <div onClick={onClick} className={`flex items-center p-4 hover:bg-slate-800/50 transition-colors cursor-pointer
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

function MobileSettingToggle({
    icon: Icon, title, enabled, isLast, onToggle
}: {
    icon: any; title: string; enabled: boolean; isLast?: boolean; onToggle: () => void;
}) {
    return (
        <div onClick={onToggle} className={`flex items-center p-4 hover:bg-slate-800/50 transition-colors cursor-pointer
            ${!isLast ? 'border-b border-slate-800' : ''}`}
        >
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-slate-800 text-slate-300">
                <Icon className="w-4 h-4" />
            </div>
            <span className="flex-1 font-medium text-slate-200">{title}</span>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${enabled ? 'bg-primary' : 'bg-slate-700'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'left-5.2' : 'left-0.5'}`} />
            </div>
        </div>
    );
}
