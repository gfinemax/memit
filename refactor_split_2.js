const fs = require('fs');

const sourcePath = 'src/components/dashboard/MemoryGenerator.tsx';
const content = fs.readFileSync(sourcePath, 'utf8');
const lines = content.split(/\r?\n/);

// We need to create src/hooks/usePasswordGenerator.ts
// We'll extract lines 40-125 for state and core functions, and lines 433-518 for animation.
// Wait, to be precise, let's find the lines using regex or indexOf.

const passwordStateStart = lines.findIndex(l => l.includes('// Password State (PC Native)'));
const ghostPromptStart = lines.findIndex(l => l.includes('// Ghost Prompt State'));

const passwordStateLines = lines.slice(passwordStateStart, ghostPromptStart).join('\n');

const animStateStart = lines.findIndex(l => l.includes('type SceneType = '));
const shareStateStart = lines.findIndex(l => l.includes('// Share State'));

const passwordAnimLines = lines.slice(animStateStart, shareStateStart).join('\n');

const passwordHookContent = `import { useState, useEffect } from 'react';
import { generatePinFromWord, wordToNumbers } from '@/lib/mnemonic-password';

export function usePasswordGenerator({ pinLength, handleConvert }: { pinLength: number, handleConvert: (customWords?: string[] | null) => void }) {
${passwordStateLines}
${passwordAnimLines}

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

fs.writeFileSync('src/hooks/usePasswordGenerator.ts', passwordHookContent);
console.log('Created usePasswordGenerator.ts');
