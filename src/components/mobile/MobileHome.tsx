'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Brain, ArrowRight, Zap, Play, Grid, ChevronRight, Quote, Heart, TrophyIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { convertNumberAction } from '@/app/actions';
import { openAIStoryService } from '@/lib/openai-story-service';
import ResultCard from './ResultCard';
import MobileFilterChips, { FilterMode } from './MobileFilterChips';
import MobileMagicInput from './MobileMagicInput';
import MobileCoverFlow from './MobileCoverFlow';

export default function MobileHome() {
    const router = useRouter();
    const [currentMode, setCurrentMode] = useState<FilterMode>('number');
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string[] | null>(null);
    const [story, setStory] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    // Advanced Generation States
    const [generatingImage, setGeneratingImage] = useState(false);
    const [generatingMessageIndex, setGeneratingMessageIndex] = useState(0);
    const [generationProgress, setGenerationProgress] = useState(0);

    const generationMessages = [
        "스토리에서 핵심 이미지를 추출하는 중...",
        "캔버스에 기억의 조각들을 배치 중...",
        "AI가 초안 스케치를 진행하고 있습니다...",
        "DALL-E가 정교한 붓 터치를 시작합니다...",
        "공간의 깊이와 조명 효과를 불어넣는 중...",
        "마지막 디테일과 질감을 다듬고 있습니다...",
        "거의 다 되었습니다! 이미지를 현상 중..."
    ];

    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        let msgInterval: NodeJS.Timeout;

        if (generatingImage) {
            setGenerationProgress(0);
            setGeneratingMessageIndex(0);

            // Progress bar logic (roughly 30 seconds)
            interval = setInterval(() => {
                setGenerationProgress(prev => {
                    if (prev >= 95) return prev;
                    return prev + (100 / (30 * 10));
                });
            }, 100);

            // Message rotation logic
            msgInterval = setInterval(() => {
                setGeneratingMessageIndex(prev => (prev + 1) % generationMessages.length);
            }, 4000);
        }

        return () => {
            clearInterval(interval);
            clearInterval(msgInterval);
        };
    }, [generatingImage]);

    const handleConvert = async () => {
        if (!input.trim() || loading || generatingImage) return;
        setLoading(true);
        setResult(null);
        setStory('');
        setImageUrl(null);

        try {
            // Step 1: Keywords
            const res = await convertNumberAction(input);
            if (res.success && res.data) {
                setResult(res.data);

                // Step 2: Story (Auto-generate for mobile simple flow)
                const storyRes = await openAIStoryService.generateStory(input, {
                    manualKeywords: res.data
                });
                setStory(storyRes.story);

                // Step 3: Image (Advanced UX starts here)
                setGeneratingImage(true);
                const url = await openAIStoryService.generateImage(storyRes.story, "Mobile App Memory");
                setImageUrl(url);
                setGenerationProgress(100);
            }
        } catch (error) {
            console.error("Mobile conversion failed:", error);
            alert("처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
        } finally {
            setLoading(false);
            setGeneratingImage(false);
        }
    };

    return (
        <div className="pb-24 bg-background-light dark:bg-background-dark min-h-screen">
            {/* Header removed: Now using Global MobileTopBar */}

            <main>
                {/* Hero Section */}
                <section className="px-5 pt-8 pb-4">
                    <h1 className="text-3xl font-bold leading-tight mb-2 text-slate-900 dark:text-white">
                        모든 순간을 기억하세요,<br />
                        <span className="text-primary">메밋</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">
                        무엇이든 3초 만에 메밋하세요.<br />복잡한 정보도 나만의 이야기로 영구 저장됩니다.
                    </p>

                    {/* Main Input Section */}
                    <div className="flex flex-col gap-4">
                        {/* 1. Filter Chips */}
                        <MobileFilterChips currentMode={currentMode} onModeChange={setCurrentMode} />

                        <div className="px-5">
                            {/* 2. Magic Input Card */}
                            <MobileMagicInput
                                value={input}
                                onChange={setInput}
                                mode={currentMode}
                                placeholder={
                                    currentMode === 'number' ? "암기할 숫자를 입력하세요 (예: 3.141592)" :
                                        currentMode === 'password' ? "생성 키워드를 입력하세요 (예: 네이버 비번)" :
                                            "기억하고 싶은 내용을 자유롭게 적어보세요..."
                                }
                            />
                        </div>
                        <div className="px-5">
                            <button
                                onClick={handleConvert}
                                disabled={loading || !input.trim()}
                                className={`
                                    w-full py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none
                                    ${input.trim()
                                        ? 'bg-gradient-to-r from-primary to-indigo-600 text-white shadow-primary/30 translate-y-0'
                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                    }
                                `}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <Zap className="w-5 h-5 text-yellow-300" fill="currentColor" />
                                )}
                                {loading ? '생성 중...' : '메밋 생성하기'}
                            </button>
                        </div>
                    </div>

                    {result && (
                        <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            <ResultCard
                                input={input}
                                keywords={result}
                                story={{ text: story, highlighted: [] }}
                                imageUrl={imageUrl || undefined}
                                onSave={() => { }}
                                onReset={() => {
                                    setResult(null);
                                    setStory('');
                                    setImageUrl(null);
                                    setInput('');
                                }}
                            />
                        </div>
                    )}

                    {/* Advanced Generation UI Overlay */}
                    {generatingImage && (
                        <div className="fixed inset-0 z-[100] bg-black/9Center overflow-hidden flex flex-col items-center justify-center p-6 backdrop-blur-xl">
                            <div className="w-full max-w-sm space-y-8 text-center">
                                {/* Cinema-style Loading Animation */}
                                <div className="relative aspect-square w-full max-w-[280px] mx-auto overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 animate-pulse"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative">
                                            <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                            <Brain className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                                        </div>
                                    </div>
                                    {/* Scanning Light Effect */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(79,70,229,0.8)] animate-scan-y opacity-50"></div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white tracking-tight animate-pulse">
                                        {generationMessages[generatingMessageIndex]}
                                    </h3>
                                    <p className="text-slate-400 text-sm">기억의 퍼즐을 맞추는 중입니다...</p>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full space-y-2">
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                                            style={{ width: `${generationProgress}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                                        <span>Initialising AI</span>
                                        <span>{Math.round(generationProgress)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Service Link */}
                <section className="px-5 py-4">
                    <Link href="/memit/services" className="w-full group bg-white dark:bg-[#1e1c30] hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-primary dark:text-indigo-300">
                                <Grid className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">다른 암기 서비스 보기</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">보안, 비즈니스, 학습 등 더 많은 카테고리</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </Link>
                </section>

                {/* Hall of Fame (Converted to MobileCoverFlow) */}
                <section className="py-8">
                    <div className="px-5 mb-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <TrophyIcon className="w-5 h-5 text-yellow-500" />
                            명예의 전당
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">다른 사용자들이 생성한 놀라운 기억법을 확인하세요.</p>
                    </div>

                    <MobileCoverFlow />
                </section>

                {/* Banner */}
                <section className="px-5 mt-4">
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 flex flex-col justify-end p-5">
                            <p className="text-white font-bold text-lg mb-1">기억의 궁전 체험하기</p>
                            <p className="text-white/80 text-xs">지금 무료로 시작하고 뇌 잠재력을 깨우세요.</p>
                        </div>
                        <img className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrjkqA0PK5F73_khPA8VvmE506ni8v1sVeR1FxG5nVj29YRvSwweDOn8TPn2546dAoz8RV3yg9ZZfqQgapNoV31cu2VsB4oeWNgcOabtXViGqVBAsJ-3Rm-9cYPbSqfywvaZr1wdNXID5KZCUHzfJLW8URVRr6itnw5QgKmCkzXf6Ejv6nGXug6V-NNEUYH1PKb3qM18aMmfQHeD_qvdneOaNDvzsAks0nge3-_2CShI8BWHrt1mq-Wyt31opi9wfGYpQikFDgohEu" alt="Banner" />
                    </div>
                </section>
            </main>
        </div>
    );
}

