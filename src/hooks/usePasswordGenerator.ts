import { useState, useEffect } from 'react';
import { generatePinFromWord, wordToNumbers } from '@/lib/mnemonic-password';

export function usePasswordGenerator(
    pinLength: 4 | 6 | 8,
    handleConvert: (customWords?: string[] | null, forcedInput?: string, theme?: string, onInputUpdate?: (val: string) => void, onResultUpdate?: (res: string) => void) => void,
    setPinLength: (len: 4 | 6 | 8) => void,
    pin8SplitMode: '4+4' | '6+2' | '4+2+2' | '자유',
    setPin8SplitMode: (mode: '4+4' | '6+2' | '4+2+2' | '자유') => void
) {
    // Password State
    const [passwordLevel, setPasswordLevel] = useState<'L1_PIN' | 'L2_WEB' | 'L3_MASTER'>('L1_PIN');
    const [serviceName, setServiceName] = useState('');
    const [coreNumber, setCoreNumber] = useState('');
    const [specialSymbol, setSpecialSymbol] = useState('!');
    const [hintKeyword, setHintKeyword] = useState('');
    const [activeTheme, setActiveTheme] = useState<string | null>(null);
    const [passwordResult, setPasswordResult] = useState('');
    const [passwordCopied, setPasswordCopied] = useState(false);
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

    const themeDatasets: Record<string, string[]> = {
        '🎬 영화': ['감독', '배우', '극장', '영화', '액션', '멜로', '공포', '주연', '자막', '명작'],
        '🐶 동물': ['사자', '토끼', '여우', '기린', '하마', '고래', '나비', '오리', '늑대', '백조'],
        '🍕 음식': ['피자', '김밥', '초밥', '라면', '만두', '우유', '커피', '콜라', '순대', '튀김'],
        '✈️ 여행': ['파리', '런던', '뉴욕', '도쿄', '부산', '제주', '서울', '바다', '공항', '캠핑'],
        '🎲 랜덤': ['하늘', '노래', '나무', '선물', '사랑', '친구', '시간', '시계', '편지', '행복']
    };

    const handleSuggestionClick = (word: string) => {
        setHintKeyword(word);
        setActiveTheme(null);
        if (word.trim()) {
            const rawDigits = wordToNumbers(word.trim());
            const maxLength = passwordLevel === 'L1_PIN' ? pinLength : 8;
            setCoreNumber(rawDigits.slice(0, maxLength));
        } else {
            setCoreNumber('');
        }
    };

    const [isCustomLength, setIsCustomLength] = useState(false);

    const getLengthForLevel = (level: string) => {
        if (level === 'L1_PIN') return pinLength;
        if (level === 'L2_WEB') return 6;
        return 8; // L3_MASTER
    };

    const handleThemeClick = (theme: string) => {
        if (activeTheme === theme) {
            setActiveTheme(null);
        } else {
            setActiveTheme(theme);
        }
    };

    const handleHintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setHintKeyword(val);
        setActiveTheme(null);
        if (val.trim()) {
            const rawDigits = wordToNumbers(val.trim());
            const maxLength = passwordLevel === 'L1_PIN' ? pinLength : 8;
            setCoreNumber(rawDigits.slice(0, maxLength));
        } else {
            setCoreNumber('');
        }
    };

    const generatePassword = () => {
        if (!coreNumber) return;

        let finalPassword = '';
        if (passwordLevel === 'L1_PIN') {
            finalPassword = coreNumber;
        } else if (passwordLevel === 'L2_WEB') {
            const cleanName = serviceName ? serviceName.replace(/\s+/g, '') : '앱';
            const cName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
            finalPassword = `${cName}${coreNumber}${specialSymbol}`;
        } else {
            const cleanName = serviceName ? serviceName.replace(/\s+/g, '') : '앱';
            const mixedCaseName = cleanName.split('').map((char, i) =>
                i % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
            ).join('');
            finalPassword = `${mixedCaseName}${specialSymbol}${coreNumber}`;
        }

        setPasswordResult(finalPassword);

        let customWords: string[] | null = null;
        if (passwordLevel === 'L1_PIN' && hintKeyword.trim()) {
            customWords = hintKeyword.split(/[, ]+/).filter(w => w.trim());
        }

        // We handle setInput from the main component indirectly, but ideally it calls handleConvert
        setTimeout(() => handleConvert(customWords), 100);
    };

    const copyPassword = () => {
        if (!passwordResult) return;
        navigator.clipboard.writeText(passwordResult);
        setPasswordCopied(true);
        setTimeout(() => setPasswordCopied(false), 2000);
    };

    // Scene definitions
    type SceneType = 'text' | 'text-highlight' | 'example-simple' | 'example-word' | 'example-complex' | 'complex-horizontal-input' | 'complex-horizontal-breakdown' | 'complex-horizontal-result' | 'complex-horizontal-full';

    interface Scene {
        type: SceneType;
        duration: number;
        content?: string;
        wordData?: { word: string, result: string };
        complexData?: { input: string, breakdown: string, result: string };
    }

    const passwordScenes: Record<string, Scene[]> = {
        'L1_PIN': [
            { type: 'text', duration: 2500, content: "단어 및 원하는 숫자를 입력하세요." },
            { type: 'text-highlight', duration: 2500, content: "이를 기반으로 나만의 핀번호 스토리를 만들어 드립니다." },
            { type: 'example-simple', duration: 1500, content: "1004" },
            { type: 'example-simple', duration: 1500, content: "828255" },
            { type: 'example-simple', duration: 1500, content: "01234567" },
            { type: 'text', duration: 3500, content: "최대 20자리 숫자까지 비밀번호 생성이 가능합니다." }
        ],
        'L2_WEB': [
            { type: 'text', duration: 2500, content: "기억하기 쉬운 단어나 의미 있는 숫자를 입력하세요." },
            { type: 'text-highlight', duration: 2500, content: "입력하신 키워드를 분석하여 영문+숫자 조합 암호를 제시합니다." },
            { type: 'example-word', duration: 3000, wordData: { word: "사과", result: "apple1004" } },
            { type: 'example-word', duration: 3000, wordData: { word: "여행", result: "Trip7890" } },
            { type: 'example-word', duration: 3000, wordData: { word: "바다", result: "Sea2026" } }
        ],
        'L3_MASTER': [
            { type: 'text', duration: 2000, content: "가장 소중한 핵심 키워드를 입력하세요." },
            { type: 'text-highlight', duration: 2000, content: "절대 잊히지 않을 가장 강력한 단 하나의 암호" },
            { type: 'complex-horizontal-input', duration: 1500, complexData: { input: '우리집 강아지 뽀삐', breakdown: '', result: '' } },
            { type: 'complex-horizontal-breakdown', duration: 1500, complexData: { input: '', breakdown: '88(뽀삐)+706(강아지)', result: '' } },
            { type: 'complex-horizontal-result', duration: 1500, complexData: { input: '', breakdown: '', result: '88dog706!' } },
            { type: 'complex-horizontal-full', duration: 4000, complexData: { input: '우리집 강아지 뽀삐', breakdown: '88(뽀삐)+706(강아지)', result: '88dog706!' } }
        ]
    };


    // Reset index on level change to prevent out-of-bounds
    useEffect(() => {
        setCurrentSceneIndex(0);
    }, [passwordLevel]);

    // Password Tab Enhanced Animation Effect
    useEffect(() => {
        // Run animation indefinitely while we haven't typed a coreNumber
        if (coreNumber.length > 0) {
            setCurrentSceneIndex(0);
            return;
        }

        const scenes = passwordScenes[passwordLevel];
        if (!scenes || currentSceneIndex >= scenes.length) return;

        const currentScene = scenes[currentSceneIndex];

        const timeout = setTimeout(() => {
            setCurrentSceneIndex((prev) => (prev + 1) % scenes.length);
        }, currentScene.duration);

        return () => clearTimeout(timeout);
    }, [coreNumber, currentSceneIndex, passwordLevel, passwordScenes]);

    return {
        passwordLevel, setPasswordLevel,
        serviceName, setServiceName,
        coreNumber, setCoreNumber,
        specialSymbol, setSpecialSymbol,
        hintKeyword, setHintKeyword,
        activeTheme, setActiveTheme,
        passwordResult, setPasswordResult,
        passwordCopied, setPasswordCopied,
        currentSceneIndex, setCurrentSceneIndex,
        passwordScenes,
        pinLength, setPinLength,
        pin8SplitMode, setPin8SplitMode,
        isCustomLength, setIsCustomLength,
        themeDatasets,
        handleSuggestionClick,
        getLengthForLevel,
        handleThemeClick,
        handleHintChange,
        generatePassword,
        copyPassword,
        handleConvert
    };
}
