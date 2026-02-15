'use client';

import React from 'react';
import { Quote, Heart } from 'lucide-react';

// Using the same data structure as the original MobileHome for compatibility
interface MemoryCardProps {
    title: string;
    description: string;
    user: string;
    userImage: string;
    timeAgo: string;
    likes: number;
    color: string;
}

const DUMMY_DATA: MemoryCardProps[] = [
    {
        title: "원주율 100자리 외우기",
        description: "3.14159... 숫자를 거대한 우주 정거장의 방 번호로 바꿔서 기억했습니다.",
        user: "김지수",
        userImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQp78p9_EmjD6tz8xlY-Ltf7WlxvNHUph5rcihBE6kJ237xfyvsc-pyyb1wysrWt5Q1YI22Duz-kY0AsA5pNnrvPm4qzpxUb-anyavJDjHYPp-nzf8XIP2bFf5soBv-e2veMVkl7plpi4xE9vDmadV0H2pXULaIcouBk3q45AdhdXm3UX8fo91TpWuGu-RNo9-KYWP_cPe_ZAQz-33P2bk7Qv52WkVj3QyyknwkFypiEC2-y3UndW1vlMoBZeWK9PAPqMFW9QNRIcR",
        timeAgo: "2시간 전",
        likes: 1240,
        color: "bg-indigo-500"
    },
    {
        title: "한국사 연도표 암기",
        description: "임진왜란 1592년을 '이리오 구이' 굽는 장면으로 연상해서 외우니까 절대 안 잊어버리네요!",
        user: "박민준",
        userImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-CBxnd15NTUZ8yBRN-cAQpts-Yt6p0VTIbPF-gjwhGO8-mrD8uDbct7OGY0LX1MdyVC-tcxXLSmTWFaRMT0sHylQYaox_aTBvKqenq4cdyd5RaYxgEuXGGmz33FMgIEUQayDVkFBwi2B-hDAiO_tRYQpS7dL4Gvbk_uTKuBXzzz83tjk6amhnK5GJ1XwdSBfzYFxASIhX0nOjERdyvnONl2lK3nNzcAwZeNFJuQ5cFZROHpCgxFFoakv3K1gBs54dMMfs3yjFvpll",
        timeAgo: "5시간 전",
        likes: 850,
        color: "bg-rose-500"
    },
    {
        title: "주기율표 20번까지",
        description: "수소부터 칼슘까지 아파트 층수별 거주자로 만들어서 외웠습니다. 1층 사는 수소 아저씨...",
        user: "이서연",
        userImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuM7yQyZ4Gj5sW8zH9vJ2l3fKq6wE0oR5tU8i11O9pL4aG7mS3dJ2b1c6xF5h8n0i4r7v3e9k2t1l6y_5j8u0w7x4z1s3q9v2p8o6n5m",
        timeAgo: "1일 전",
        likes: 2103,
        color: "bg-emerald-500"
    }
];

export default function MobileCoverFlow() {
    return (
        <div className="w-full overflow-x-auto no-scrollbar pb-6 pt-2 pl-5 snap-x snap-mandatory">
            <div className="flex gap-4 pr-5 min-w-max">
                {DUMMY_DATA.map((item, idx) => (
                    <div
                        key={idx}
                        className="
                            relative w-[85vw] max-w-[320px] h-48 rounded-2xl p-6 snap-center shrink-0
                            bg-white dark:bg-[#1e1c30] border border-slate-100 dark:border-white/10
                            shadow-lg shadow-slate-200/50 dark:shadow-black/50
                            flex flex-col justify-between overflow-hidden group
                            transform transition-transform active:scale-95
                        "
                    >
                        {/* Decorative Gradient Background */}
                        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] opacity-10 ${item.color}`}></div>

                        {/* Quote Icon */}
                        <div className="absolute top-4 right-4 text-slate-200 dark:text-slate-700 opacity-50">
                            <Quote className="w-10 h-10 fill-current" />
                        </div>

                        {/* Top Content */}
                        <div className="relative z-10">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white mb-2 ${item.color} bg-opacity-80`}>
                                BEST MEMORY
                            </span>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight mb-2 pr-8">
                                {item.title}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                {item.description}
                            </p>
                        </div>

                        {/* Bottom User Info */}
                        <div className="relative z-10 flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white dark:ring-slate-700">
                                    <img src={item.userImage} alt={item.user} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.user}</div>
                                    <div className="text-[10px] text-slate-400">{item.timeAgo}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-rose-500 font-bold text-xs bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-full">
                                <Heart className="w-3 h-3 fill-current" />
                                {item.likes.toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
