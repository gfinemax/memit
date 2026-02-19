'use client';

import React, { useState } from 'react';
import PasswordLevelSelector, { PasswordLevel } from './PasswordLevelSelector';
import PasswordInputStep from './PasswordInputStep';
import PasswordResultStep from './PasswordResultStep';
import { suggestPassword, PasswordGenerationResult } from '@/lib/mnemonic-password';

type WizardStep = 'LEVEL' | 'INPUT' | 'RESULT';

export default function PasswordGeneratorWizard() {
    const [step, setStep] = useState<WizardStep>('LEVEL');
    const [level, setLevel] = useState<PasswordLevel | null>(null);
    const [result, setResult] = useState<PasswordGenerationResult | null>(null);

    const handleLevelSelect = (selectedLevel: PasswordLevel) => {
        setLevel(selectedLevel);
        setStep('INPUT');
    };

    const handleGenerate = async (serviceName: string, userSalt: string, manualNumber?: string) => {
        if (!level) return;

        try {
            const res = await suggestPassword(serviceName, userSalt, level, manualNumber);
            setResult(res);
            setStep('RESULT');
        } catch (error) {
            console.error('Password generation failed:', error);
        }
    };

    const handleReset = () => {
        setStep('LEVEL');
        setLevel(null);
        setResult(null);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {step === 'LEVEL' && (
                <PasswordLevelSelector
                    selectedLevel={level}
                    onSelect={handleLevelSelect}
                />
            )}

            {step === 'INPUT' && level && (
                <PasswordInputStep
                    level={level}
                    onGenerate={handleGenerate}
                    onBack={() => setStep('LEVEL')}
                />
            )}

            {step === 'RESULT' && result && (
                <PasswordResultStep
                    result={result}
                    onClose={handleReset}
                />
            )}
        </div>
    );
}
