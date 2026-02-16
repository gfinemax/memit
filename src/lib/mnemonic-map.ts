/**
 * Shared mnemonic number-to-consonant mapping used by both
 * desktop MnemonicKey and mobile MobileMagicInput / MobileMnemonicKey.
 */

export interface MnemonicEntry {
    num: string;
    consonants: string;  // Display consonants (e.g., 'ㄱㅋ')
    label: string;       // Full name (e.g., '기역,키읔')
    word: string;        // Example word (e.g., '감')
}

export const MNEMONIC_MAP: MnemonicEntry[] = [
    { num: '0', consonants: 'ㅇ', label: '이응', word: '알' },
    { num: '1', consonants: 'ㄱㅋ', label: '기역,키읔', word: '감' },
    { num: '2', consonants: 'ㄴㄹ', label: '니은,리을', word: '논' },
    { num: '3', consonants: 'ㄷㅌ', label: '디귿,티읕', word: '달' },
    { num: '4', consonants: 'ㅁㅂ', label: '미음,비읍', word: '물' },
    { num: '5', consonants: 'ㅅ', label: '시옷', word: '산' },
    { num: '6', consonants: 'ㅈ', label: '지읒', word: '종' },
    { num: '7', consonants: 'ㅊ', label: '치읓', word: '차' },
    { num: '8', consonants: 'ㅍ', label: '피읍', word: '파' },
    { num: '9', consonants: 'ㅎ', label: '히읗', word: '해' },
];

/**
 * Given a single character (digit), return the consonant(s).
 * Non-digit characters return undefined.
 */
export function getConsonants(char: string): string | undefined {
    const entry = MNEMONIC_MAP.find(e => e.num === char);
    return entry?.consonants;
}
