const fs = require('fs');
const content = fs.readFileSync('src/components/dashboard/MemoryGenerator.tsx', 'utf8');
const lines = content.split('\n');

// Find boundaries
function getIndex(str) { return lines.findIndex(l => l.includes(str)); }

const head = getIndex('export default function MemoryGenerator');
const memState = getIndex('// Memory State');
const passState = getIndex('// Password State (PC Native)');
const ghostState = getIndex('// Ghost Prompt State');
const pinState = getIndex('// PIN Length State');
const animState = getIndex('// Enhanced Password Animation State');
const shareState = getIndex('// Share State');
const convertFunc = getIndex('const handleConvert = async');
const memTabStart = getIndex('{activeTab === \'memory\' ? (');
const passTabStart = getIndex(') : (');
const returnEnd = getIndex('</section>');

// Create usePasswordGenerator.ts
const passHook = `import { useState, useEffect } from 'react';
import { generatePinFromWord, wordToNumbers } from '@/lib/mnemonic-password';

export function usePasswordGenerator(pinLength: number, handleConvert: (customWords?: string[] | null) => void) {
${lines.slice(passState, ghostState).join('\n')}
${lines.slice(animState, shareState).join('\n')}

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
        getLengthForLevel,
        handleThemeClick,
        handleHintChange,
        generatePassword,
        copyPassword
    };
}
`;
fs.writeFileSync('src/hooks/usePasswordGenerator.ts', passHook);

// Create useMemoryGenerator.ts
// Memory needs: memState to passState, ghostState to pinState, pinState to animState, shareState to memTabStart (minus return)
const memHook = `import { useState, useEffect, useRef } from 'react';
import { generateShareCardCanvas } from '@/lib/share-card-utils';
import { openAIStoryService } from '@/lib/openai-story-service';
import { convertNumberAction, saveMemoryAction } from '@/app/actions_v2';

export function useMemoryGenerator(onMemorySaved?: () => void, category?: string) {
${lines.slice(memState, passState).join('\n')}
${lines.slice(ghostState, animState).join('\n')}
${lines.slice(shareState, memTabStart - 1).join('\n')}

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
        handleConvert, wordToBaseNumbers,
        handleSaveMemory, toggleAllLocks, toggleLock, handleWordLock,
        handleImageGeneration, getProxyImageUrl, handleDownload, handleShare
    };
}
`;
fs.writeFileSync('src/hooks/useMemoryGenerator.ts', memHook);

// Extract Tabs UI
// MemoryTab UI
const memTabLines = lines.slice(memTabStart + 1, passTabStart); // everything between ternary branches
fs.writeFileSync('src/components/dashboard/tabs/MemoryTab.tsx', `import React from 'react';\n// TODO imports\nexport function MemoryTab({ memoryProps, isKeyExpanded, setIsKeyExpanded }: any) {\nconst { input, setInput, context, setContext, result, lockedIndices, loading, handleConvert, strategy, setStrategy, showPlaceholder, ghostInput, saving, isSaved, handleSaveMemory, toggleAllLocks } = memoryProps;\nreturn (\n${memTabLines.join('\n')}\n);\n}`);

// PasswordTab UI
const passTabLines = lines.slice(passTabStart + 1, returnEnd - 2);
fs.writeFileSync('src/components/dashboard/tabs/PasswordTab.tsx', `import React from 'react';\n// TODO imports\nexport function PasswordTab({ passwordProps, memoryProps }: any) {\nreturn (\n${passTabLines.join('\n')}\n);\n}`);

console.log("Refactoring split complete!");
