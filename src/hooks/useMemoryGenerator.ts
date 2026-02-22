import { useState, useEffect, useRef } from 'react';
import { generateShareCardCanvas, ShareKeywordItem } from '@/lib/share-card-utils';
import { openAIStoryService } from '@/lib/openai-story-service';
import { convertNumberAction, saveMemoryAction } from '@/app/actions_v2';

export function useMemoryGenerator({ category = 'general', onMemorySaved, activeTab }: { category?: string, onMemorySaved?: () => void, activeTab: 'memory' | 'password' }) {
    // Memory State
    const [input, setInput] = useState('');
    const [context, setContext] = useState('');
    const [result, setResult] = useState<string[] | null>(null);
    const [story, setStory] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [generatingImage, setGeneratingImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [strategy, setStrategy] = useState<'SCENE' | 'PAO' | 'STORY_BEAT'>('SCENE');
    const [isSelecting, setIsSelecting] = useState(false);
    const [revealedCount, setRevealedCount] = useState(0);
    const [candidates, setCandidates] = useState<{ chunk: string, words: string[] }[]>([]);
    const [imageType, setImageType] = useState<'single' | 'quad'>('single');
    const [activePopoverIndex, setActivePopoverIndex] = useState<number | null>(null);
    const [isModified, setIsModified] = useState(false);
    const [lastConvertedInput, setLastConvertedInput] = useState('');
    const [lockedIndices, setLockedIndices] = useState<number[]>([]);
    const [saving, setSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isEditingStory, setIsEditingStory] = useState(false);

    // Ghost Prompt State
    const [ghostInput, setGhostInput] = useState('');
    const [isGhostTyping, setIsGhostTyping] = useState(true);
    const [ghostIndex, setGhostIndex] = useState(0);
    const [showPlaceholder, setShowPlaceholder] = useState(true);

    const [autoGenerateImage, setAutoGenerateImage] = useState(false);

    // PIN Length State
    const [pinLength, setPinLength] = useState<4 | 6 | 8>(4);
    const [pin8SplitMode, setPin8SplitMode] = useState<'4+4' | '6+2' | '4+2+2' | '자유'>('4+4');

    const ghostExamplesMap = {
        4: ['3755', '1004', '8282'],
        6: ['100482', '828255', '123456'],
        8: ['24681357', '10048282', '87654321']
    };
    const ghostExamples = ghostExamplesMap[pinLength];

    // Share State
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [sharePrefix010, setSharePrefix010] = useState(false);
    const [shareLabel, setShareLabel] = useState('');
    const [shareTitle, setShareTitle] = useState('');
    const labelInputRef = useRef<HTMLInputElement>(null);
    const titleInputRef = useRef<HTMLTextAreaElement>(null);
    const isComposingRef = useRef(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);


    const handleConvert = async (customWords?: string[] | null) => {
        if (!input.trim() || loading) return;
        const isSameInput = input.trim() === lastConvertedInput;

        setLoading(true);
        setIsSelecting(true);
        setRevealedCount(0);

        if (!isSameInput) {
            setResult(null);
            setCandidates([]);
            setIsModified(false);
            setLockedIndices([]);
        }

        setStory(null);
        setImageUrl(null);
        setActivePopoverIndex(null);
        setIsEditingStory(false);

        if (customWords && customWords.length > 0) {
            // Bypass number conversion if we already have the exact words mapped
            const customCandidates = customWords.map((word, index) => {
                const chunk = input.replace(/[^0-9]/g, '').slice(index * 2, (index * 2) + 2);
                return { chunk: chunk || '00', words: [word] };
            });
            setCandidates(customCandidates);
            setResult(customWords);
            setRevealedCount(customWords.length);

            try {
                const data = await openAIStoryService.generateStory(input, {
                    candidates: customCandidates,
                    context,
                    strategy,
                    manualKeywords: customWords
                });
                setStory(data.story);
            } catch (error) {
                console.error("AI Story generation failed:", error);
                setStory("스토리 생성 중 오류가 발생했습니다.");
            }
            setIsSelecting(false);
            setLoading(false);
            setLastConvertedInput(input.trim());
            return;
        }

        const res = await convertNumberAction(input);
        if (res.success && res.data) {
            const currentCandidates = res.candidates || [];
            setCandidates(currentCandidates as { chunk: string, words: string[] }[]);

            try {
                const data = await openAIStoryService.generateStory(input, {
                    candidates: currentCandidates,
                    context,
                    strategy,
                    manualKeywords: (isSameInput || lockedIndices.length > 0) ? result || undefined : undefined
                });

                const finalKeywords = Array(currentCandidates.length).fill('').map((_, idx) => {
                    if (lockedIndices.includes(idx) && result && result[idx]) return result[idx];
                    if (data.keywords && data.keywords[idx]) return data.keywords[idx];
                    return currentCandidates[idx].words[0] || '???';
                });

                setResult(finalKeywords);

                for (let i = 1; i <= finalKeywords.length; i++) {
                    await new Promise(r => setTimeout(r, 400));
                    setRevealedCount(i);
                }

                setStory(data.story);
                setIsSelecting(false);
                setLoading(false);
                setLastConvertedInput(input.trim());
            } catch (error) {
                console.error("AI Story generation failed:", error);
                setResult(res.data as string[]);
                const errorDetail = error instanceof Error ? error.message : String(error);
                setStory(`스토리 생성 중 오류가 발생했습니다. (${errorDetail})`);
                setRevealedCount((res.data as string[]).length);
                setIsSelecting(false);
                setLoading(false);
                setLastConvertedInput(input.trim());
            }
        } else {
            setLoading(false);
            setIsSelecting(false);
            setImageUrl(null);
        }
    };

    // Share Helpers
    useEffect(() => {
        if (result && result.length > 0 && candidates.length > 0) {
            const words = result.join(', ');
            const lastWord = result[result.length - 1];
            const lastChar = lastWord.charAt(lastWord.length - 1);
            const hasBatchim = (lastChar.charCodeAt(0) - 0xAC00) % 28 > 0;
            const particle = hasBatchim ? '을' : '를';
            setShareTitle(`✨ ${category === 'password' ? '암호' : '정보'}를 쉽게 기억하세요.\n아래 그림에서 [${words}] ${particle} 찾아보세요.\n기억의 열쇠가 됩니다.`);
        }
    }, [result, candidates, category]);

    const handleDebouncedInput = () => {
        if (isComposingRef.current) return;
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(async () => {
            const currentTitle = titleInputRef.current?.value || shareTitle;
            const currentLabel = labelInputRef.current?.value || shareLabel;

            const shareKeywords: ShareKeywordItem[] = (result || []).map((word, i) => ({
                word,
                code: candidates[i]?.chunk || ''
            }));

            const dataUrl = await generateShareCardCanvas(
                input || '', shareKeywords, story || '', imageUrl || '',
                {
                    prefix010: sharePrefix010,
                    customLabel: currentLabel,
                    customTitle: currentTitle,
                    isPinMode: activeTab === 'password'
                }
            );
            setPreviewUrl(dataUrl);
        }, 500);
    };

    const handleOpenShareModal = async () => {
        setIsCapturing(true);
        try {
            const shareKeywords: ShareKeywordItem[] = (result || []).map((word, i) => ({
                word,
                code: candidates[i]?.chunk || ''
            }));

            const dataUrl = await generateShareCardCanvas(
                input || '',
                shareKeywords,
                story || '',
                imageUrl || '',
                {
                    prefix010: sharePrefix010,
                    customLabel: shareLabel,
                    customTitle: shareTitle,
                    isPinMode: activeTab === 'password'
                }
            );
            setPreviewUrl(dataUrl);
        } catch (error) {
            console.error('Failed to generate share card:', error);
        } finally {
            setIsCapturing(false);
        }
    };

    const handleShare = async () => {
        if (!previewUrl) return;
        setIsSharing(true);
        try {
            if (navigator.share) {
                const blob = await (await fetch(previewUrl)).blob();
                const file = new File([blob], 'memit_card.png', { type: 'image/png' });
                await navigator.share({ title: 'Memit AI - 나만의 기억법', files: [file] });
            } else {
                const link = document.createElement('a');
                link.download = `memit_card_${Date.now()}.png`;
                link.href = previewUrl;
                link.click();
            }
        } catch (error) {
            console.error('Share failed:', error);
            const link = document.createElement('a');
            link.download = `memit_card_${Date.now()}.png`;
            link.href = previewUrl;
            link.click();
        } finally {
            setIsSharing(false);
        }
    };

    const handleSingleWordChange = (index: number, newWord: string) => {
        if (!result) return;
        const newResult = [...result];
        newResult[index] = newWord;
        setResult(newResult);
        setIsModified(true);
        setActivePopoverIndex(null);
        if (!lockedIndices.includes(index)) {
            setLockedIndices([...lockedIndices, index]);
        }
    };

    const toggleLock = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        if (lockedIndices.includes(index)) {
            setLockedIndices(lockedIndices.filter(i => i !== index));
        } else {
            setLockedIndices([...lockedIndices, index]);
        }
    };

    const toggleAllLocks = () => {
        if (!result) return;
        if (lockedIndices.length === result.length) {
            setLockedIndices([]);
        } else {
            setLockedIndices(result.map((_, i) => i));
        }
    };

    const [generatingMessageIndex, setGeneratingMessageIndex] = useState(0);
    const [generationProgress, setGenerationProgress] = useState(0);

    // Ghost Typing Effect
    useEffect(() => {
        if (input.length > 0) {
            setGhostInput('');
            setShowPlaceholder(false);
            return;
        }

        if (showPlaceholder) {
            const initialTimeout = setTimeout(() => {
                setShowPlaceholder(false);
            }, 3000);
            return () => clearTimeout(initialTimeout);
        }

        let timeout: NodeJS.Timeout;
        const currentExample = ghostExamples[ghostIndex];

        if (isGhostTyping) {
            if (ghostInput.length < currentExample.length) {
                const delay = ghostInput.length === 0 ? 1200 : 250;
                timeout = setTimeout(() => {
                    setGhostInput(currentExample.slice(0, ghostInput.length + 1));
                }, delay);
            } else {
                timeout = setTimeout(() => {
                    setIsGhostTyping(false);
                }, 2000);
            }
        } else {
            if (ghostInput.length > 0) {
                timeout = setTimeout(() => {
                    setGhostInput(ghostInput.slice(0, -1));
                }, 100);
            } else {
                const nextIndex = (ghostIndex + 1) % ghostExamples.length;
                setGhostIndex(nextIndex);
                setIsGhostTyping(true);
                if (nextIndex === 0) {
                    setShowPlaceholder(true);
                }
            }
        }

        return () => clearTimeout(timeout);
    }, [input, ghostInput, isGhostTyping, ghostIndex, showPlaceholder, ghostExamples]);

    const generationMessages = [
        "스토리에서 핵심 이미지를 추출하는 중...",
        "캔버스에 기억의 조각들을 배치 중...",
        "AI가 초안 스케치를 진행하고 있습니다...",
        "DALL-E가 정교한 붓 터치를 시작합니다...",
        "공간의 깊이와 조명 효과를 불어넣는 중...",
        "마지막 디테일과 질감을 다듬고 있습니다...",
        "거의 다 되었습니다! 이미지를 현상 중..."
    ];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let msgInterval: NodeJS.Timeout;

        if (generatingImage) {
            setGenerationProgress(0);
            setGeneratingMessageIndex(0);

            interval = setInterval(() => {
                setGenerationProgress(prev => {
                    if (prev >= 95) return prev;
                    return prev + (100 / (30 * 10));
                });
            }, 100);

            msgInterval = setInterval(() => {
                setGeneratingMessageIndex(prev => (prev + 1) % generationMessages.length);
            }, 4000);
        }

        return () => {
            clearInterval(interval);
            clearInterval(msgInterval);
        };
    }, [generatingImage, generationMessages.length]);

    const handleGenerateImage = async () => {
        if (!story || generatingImage) return;
        setGeneratingImage(true);
        try {
            const url = await openAIStoryService.generateImage(story, context, imageType === 'quad');
            setImageUrl(url);
            setGenerationProgress(100);
        } catch (error: any) {
            console.error("Image generation failed:", error);
            if (error.message === "SAFETY_FILTER_TRIGGERED") {
                alert("스토리가 너무 자극적이거나 위험 요소가 포함되어 이미지 생성이 차단되었습니다. 조금 더 부드러운 맥락(Context)을 입력해 보시겠어요? 🎨");
            } else {
                const msg = error instanceof Error ? error.message : '알 수 없는 오류';
                alert(`이미지 생성 중 오류가 발생했습니다.\n${msg}`);
            }
        }
        setGeneratingImage(false);
    };

    useEffect(() => {
        if (story && autoGenerateImage && !generatingImage && !imageUrl) {
            setAutoGenerateImage(false);
            handleGenerateImage();
        }
    }, [story, autoGenerateImage, generatingImage, imageUrl]);

    const handleSaveMemory = async () => {
        if (!result || !story || saving || isSaved) return;
        setSaving(true);
        try {
            const res = await saveMemoryAction({
                input_number: lastConvertedInput || input,
                keywords: result,
                story: story,
                image_url: imageUrl || undefined,
                context: context || undefined,
                strategy: strategy,
                category: category
            });
            if (res.success) {
                setIsSaved(true);
                if (onMemorySaved) onMemorySaved();
                setTimeout(() => setIsSaved(false), 3000);
            } else {
                alert(res.error || "저장에 실패했습니다.");
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("저장 중 오류가 발생했습니다.");
        } finally {
            setSaving(false);
        }
    };

    return {
        input, setInput,
        context, setContext,
        result, setResult,
        story, setStory,
        imageUrl, setImageUrl,
        generatingImage, setGeneratingImage,
        loading, setLoading,
        strategy, setStrategy,
        isSelecting, setIsSelecting,
        revealedCount, setRevealedCount,
        candidates, setCandidates,
        imageType, setImageType,
        activePopoverIndex, setActivePopoverIndex,
        isModified, setIsModified,
        lastConvertedInput, setLastConvertedInput,
        lockedIndices, setLockedIndices,
        saving, setSaving,
        isSaved, setIsSaved,
        isEditingStory, setIsEditingStory,
        ghostInput, setGhostInput,
        isGhostTyping, setIsGhostTyping,
        ghostIndex, setGhostIndex,
        showPlaceholder, setShowPlaceholder,
        autoGenerateImage, setAutoGenerateImage,
        pinLength, setPinLength,
        pin8SplitMode, setPin8SplitMode,
        previewUrl, setPreviewUrl,
        isCapturing, setIsCapturing,
        isSharing, setIsSharing,
        isOptionsOpen, setIsOptionsOpen,
        sharePrefix010, setSharePrefix010,
        shareLabel, setShareLabel,
        shareTitle, setShareTitle,
        labelInputRef, titleInputRef,
        isComposingRef, debounceTimerRef,
        generatingMessageIndex, generationProgress, generationMessages,
        handleConvert, handleSaveMemory, toggleAllLocks, toggleLock, handleSingleWordChange,
        handleGenerateImage, handleDebouncedInput, handleOpenShareModal, handleShare
    };
}
