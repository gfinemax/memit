'use client';

import React, { useState } from 'react';
import {
  Brain,
  LayoutGrid,
  Trophy,
  Quote,
  Heart,
  Home,
  Library,
  User,
  ChevronRight,
  Sparkles,
  X,
  Copy,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { convertNumberAction } from './actions';

export default function MobileLandingPage() {
  const [activeTab, setActiveTab] = useState<'number' | 'password'>('number');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string[] | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConvert = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setResult(null);
    setShowResult(false);

    try {
      const response = await convertNumberAction(inputText);
      if (response.success && response.data) {
        setResult(response.data);
        setShowResult(true);
      } else {
        alert('변환에 실패했습니다.');
      }
    } catch (e) {
      console.error(e);
      alert('오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.join(' '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white antialiased selection:bg-primary/30 min-h-[100dvh] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-md mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Brain className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">MEMIT (메밋)</span>
          </div>
          <Link href="/login" className="px-4 py-1.5 rounded-full border border-primary/30 text-primary dark:text-primary-light text-sm font-medium hover:bg-primary/5 transition-colors">
            로그인
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        {/* Hero Section */}
        <section className="px-5 pt-8 pb-4">
          <h1 className="text-3xl font-bold leading-tight mb-2 text-gray-900 dark:text-white">
            모든 순간을 기억하세요,<br />
            <span className="text-primary">메밋</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm leading-relaxed">
            무엇이든 3초 만에 메밋하세요.<br />복잡한 정보도 나만의 이야기로 영구 저장됩니다.
          </p>

          {/* Conversion Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-primary/5 border border-gray-100 dark:border-gray-700 overflow-hidden relative transition-all duration-300">
            <div className="p-1.5 bg-gray-100/50 dark:bg-gray-900/50 m-4 rounded-xl flex gap-1">
              <button
                onClick={() => setActiveTab('number')}
                className={`flex-1 py-2.5 px-4 rounded-lg shadow-sm font-semibold text-sm text-center transition-all ${activeTab === 'number' ? 'bg-white dark:bg-gray-800 text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                숫자 암기
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm text-center transition-all ${activeTab === 'password' ? 'bg-white dark:bg-gray-800 text-primary shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                비밀번호 생성
              </button>
            </div>

            <div className="px-4 pb-4">
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full h-32 bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-4 text-base resize-none focus:ring-2 focus:ring-primary/20 placeholder-gray-400 dark:text-white focus:outline-none transition-all"
                  placeholder="암기하고 싶은 숫자나 단어를 입력하세요...&#13;&#10;(예: 3.141592, 은행 계좌번호 등)"
                ></textarea>
                <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-medium">{inputText.length}/500</div>
              </div>
            </div>

            <div className={`px-4 pb-4 ${showResult ? 'hidden' : 'block'}`}>
              <button
                onClick={handleConvert}
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-bold text-lg shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-yellow-200" />
                    메밋 생성하기
                  </>
                )}
              </button>
            </div>

            {/* Result Area (Inline Expansion) */}
            {showResult && result && (
              <div className="px-4 pb-4 animate-in slide-in-from-bottom-4 duration-300">
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Generated Memit</span>
                    <div className="flex gap-2">
                      <button onClick={handleCopy} className="p-1.5 hover:bg-primary/10 rounded-full text-primary transition-colors">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button onClick={() => setShowResult(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {result.map((keyword, index) => (
                      <span key={index} className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-sm font-medium text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700">
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    이제 이 키워드들을 연결하여 당신만의 이야기를 만들어보세요.
                  </p>
                </div>
                <button
                  onClick={() => setShowResult(false)}
                  className="w-full mt-3 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  다시 입력하기
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Feature Section */}
        <section className="px-5 py-4">
          <button className="w-full group bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-primary dark:text-indigo-300">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">다른 암기 서비스 보기</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">보안, 비즈니스, 학습 등 더 많은 카테고리</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </button>
        </section>

        {/* Hall of Fame */}
        <section className="py-6">
          <div className="px-5 mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              명예의 전당
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">다른 사용자들이 생성한 놀라운 기억법을 확인하세요.</p>
          </div>

          <div className="flex overflow-x-auto gap-4 px-5 pb-4 no-scrollbar snap-x">
            {/* Card 1 */}
            <div className="min-w-[280px] snap-center bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12 text-primary fill-primary" />
              </div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <img
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQp78p9_EmjD6tz8xlY-Ltf7WlxvNHUph5rcihBE6kJ237xfyvsc-pyyb1wysrWt5Q1YI22Duz-kY0AsA5pNnrvPm4qzpxUb-anyavJDjHYPp-nzf8XIP2bFf5soBv-e2veMVkl7plpi4xE9vDmadV0H2pXULaIcouBk3q45AdhdXm3UX8fo91TpWuGu-RNo9-KYWP_cPe_ZAQz-33P2bk7Qv52WkVj3QyyknwkFypiEC2-y3UndW1vlMoBZeWK9PAPqMFW9QNRIcR"
                    alt="User"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-800 dark:text-gray-200">김지수</div>
                    <div className="text-[10px] text-gray-400">2시간 전</div>
                  </div>
                </div>
                <div className="flex items-center text-rose-500 text-xs font-bold bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-full">
                  <Heart className="w-3 h-3 mr-1 fill-rose-500" />
                  1.2k
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">원주율 100자리 외우기</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                3.14159... 숫자를 거대한 우주 정거장의 방 번호로 바꿔서 기억했습니다. 첫 번째 방에는...
              </p>
            </div>

            {/* Card 2 */}
            <div className="min-w-[280px] snap-center bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12 text-primary fill-primary" />
              </div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <img
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-CBxnd15NTUZ8yBRN-cAQpts-Yt6p0VTIbPF-gjwhGO8-mrD8uDbct7OGY0LX1MdyVC-tcxXLSmTWFaRMT0sHylQYaox_aTBvKqenq4cdyd5RaYxgEuXGGmz33FMgIEUQayDVkFBwi2B-hDAiO_tRYQpS7dL4Gvbk_uTKuBXzzz83tjk6amhnK5GJ1XwdSBfzYFxASIhX0nOjERdyvnONl2lK3nNzcAwZeNFJuQ5cFZROHpCgxFFoakv3K1gBs54dMMfs3yjFvpll"
                    alt="User"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-800 dark:text-gray-200">박민준</div>
                    <div className="text-[10px] text-gray-400">5시간 전</div>
                  </div>
                </div>
                <div className="flex items-center text-rose-500 text-xs font-bold bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-full">
                  <Heart className="w-3 h-3 mr-1 fill-rose-500" />
                  850
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">한국사 연도표 암기</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                임진왜란 1592년을 '이리오 구이' 굽는 장면으로 연상해서 외우니까 절대 안 잊어버리네요!
              </p>
            </div>

            {/* Card 3 */}
            <div className="min-w-[280px] snap-center bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12 text-primary fill-primary" />
              </div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">L</div>
                  <div>
                    <div className="text-xs font-bold text-gray-800 dark:text-gray-200">Lee01</div>
                    <div className="text-[10px] text-gray-400">1일 전</div>
                  </div>
                </div>
                <div className="flex items-center text-rose-500 text-xs font-bold bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-full">
                  <Heart className="w-3 h-3 mr-1 fill-rose-500" />
                  432
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">영어 단어 50개 한번에</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                어원별로 묶어서 스토리텔링을 만드니까 50개 단어가 하나의 영화처럼 느껴집니다.
              </p>
            </div>
          </div>
        </section>

        {/* Promo Section */}
        <section className="px-5 mt-4">
          <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 flex flex-col justify-end p-5">
              <p className="text-white font-bold text-lg mb-1">기억의 궁전 체험하기</p>
              <p className="text-white/80 text-xs">지금 무료로 시작하고 뇌 잠재력을 깨우세요.</p>
            </div>
            <img
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrjkqA0PK5F73_khPA8VvmE506ni8v1sVeR1FxG5nVj29YRvSwweDOn8TPn2546dAoz8RV3yg9ZZfqQgapNoV31cu2VsB4oeWNgcOabtXViGqVBAsJ-3Rm-9cYPbSqfywvaZr1wdNXID5KZCUHzfJLW8URVRr6itnw5QgKmCkzXf6Ejv6nGXug6V-NNEUYH1PKb3qM18aMmfQHeD_qvdneOaNDvzsAks0nge3-_2CShI8BWHrt1mq-Wyt31opi9wfGYpQikFDgohEu"
              alt="Promo"
            />
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 pb-safe z-50">
        <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
          <button className="flex flex-col items-center justify-center w-full h-full text-primary">
            <Home className="w-6 h-6" />
            <span className="text-[10px] mt-0.5 font-medium">홈</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <Library className="w-6 h-6" />
            <span className="text-[10px] mt-0.5 font-medium">보관함</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <User className="w-6 h-6" />
            <span className="text-[10px] mt-0.5 font-medium">마이페이지</span>
          </button>
        </div>
      </nav>
      {/* Spacer for bottom nav */}
      <div className="h-20"></div>
    </div>
  );
}
