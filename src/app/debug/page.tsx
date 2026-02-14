'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function DebugPage() {
    const [user, setUser] = useState<any>(null);
    const [memories, setMemories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                const supabase = createClient();
                if (!supabase) {
                    setError("Supabase client init failed");
                    return;
                }

                // 1. Check User
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError) throw userError;
                setUser(user);

                if (user) {
                    // 2. Fetch Memories (Raw)
                    const { data: memories, error: memError } = await supabase
                        .from('memories')
                        .select('*')
                        .order('created_at', { ascending: false });

                    if (memError) throw memError;
                    setMemories(memories || []);
                }

            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) return <div className="p-10 text-white">데이터 조회 중...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-white p-10 font-mono">
            <h1 className="text-2xl font-bold mb-6 text-primary">🕵️ 데이터 탐정 모드 (Debug)</h1>

            {error && (
                <div className="bg-red-500/20 text-red-400 p-4 rounded mb-6 border border-red-500/50">
                    ERROR: {error}
                </div>
            )}

            <div className="grid gap-8">
                {/* 1. User Info */}
                <section className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h2 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">1. 현재 로그인 정보</h2>
                    {user ? (
                        <div className="space-y-2 text-sm">
                            <p><span className="text-slate-500 w-24 inline-block">User ID:</span> <span className="text-yellow-400 font-bold">{user.id}</span></p>
                            <p><span className="text-slate-500 w-24 inline-block">Email:</span> <span className="text-green-400">{user.email}</span></p>
                            <p><span className="text-slate-500 w-24 inline-block">Provider:</span> {user.app_metadata.provider}</p>
                            <p><span className="text-slate-500 w-24 inline-block">Last Sign In:</span> {new Date(user.last_sign_in_at).toLocaleString()}</p>
                        </div>
                    ) : (
                        <p className="text-red-400 font-bold">로그인 되어있지 않습니다!</p>
                    )}
                </section>

                {/* 2. Memories Data */}
                <section className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h2 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">
                        2. 내 기억 데이터 (총 {memories.length}개)
                    </h2>

                    {memories.length === 0 ? (
                        <div className="text-slate-400 py-4">
                            데이터가 0개입니다. <br />
                            1) 정말 처음 오셨거나,<br />
                            2) <strong>다른 계정(다른 User ID)</strong>에 저장되어 있을 확률이 99%입니다.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {memories.map((m, i) => (
                                <div key={m.id} className="bg-slate-950 p-4 rounded border border-slate-800 text-xs">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-primary font-bold">#{i + 1}</span>
                                        <span className="text-slate-500">{new Date(m.created_at).toLocaleString()}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div><span className="text-slate-500">ID:</span> {m.id}</div>
                                        <div><span className="text-slate-500">User ID:</span> {m.user_id}</div>
                                        <div><span className="text-slate-500">Input:</span> {m.input_data}</div>
                                        <div><span className="text-slate-500">Category:</span> {m.category || m.metadata?.category}</div>
                                    </div>
                                    <div className="mt-2 text-slate-300">
                                        {m.encoded_data?.story || "No Story"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
