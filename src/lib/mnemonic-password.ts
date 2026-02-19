import { PasswordLevel } from '@/components/mobile/password/PasswordLevelSelector';
import { MNEMONIC_MAP } from '@/lib/mnemonic-map';
import digitsData from '../../digits_2_full.json';

// ──────────────────────────────────────────────
// Korean Chosung (초성) extraction helpers
// ──────────────────────────────────────────────

const CHOSUNG_LIST = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

/**
 * Extract 초성 from a Korean syllable character.
 * Returns the consonant character, or null if not a Korean syllable.
 */
function getChosung(char: string): string | null {
    const code = char.charCodeAt(0);
    if (code < 0xAC00 || code > 0xD7A3) return null; // Not Korean syllable
    const chosungIndex = Math.floor((code - 0xAC00) / (21 * 28));
    return CHOSUNG_LIST[chosungIndex] || null;
}

/**
 * English phone keypad mapping (ABC=2, DEF=3, ...)
 */
const ENGLISH_KEYPAD: Record<string, string> = {
    a: '2', b: '2', c: '2',
    d: '3', e: '3', f: '3',
    g: '4', h: '4', i: '4',
    j: '5', k: '5', l: '5',
    m: '6', n: '6', o: '6',
    p: '7', q: '7', r: '7', s: '7',
    t: '8', u: '8', v: '8',
    w: '9', x: '9', y: '9', z: '9',
};

/**
 * Build a reverse map: consonant char -> digit string
 * e.g. 'ㄱ' -> '1', 'ㅋ' -> '1', 'ㄴ' -> '2', 'ㄹ' -> '2', etc.
 */
function buildConsonantToDigitMap(): Record<string, string> {
    const map: Record<string, string> = {};
    for (const entry of MNEMONIC_MAP) {
        for (const ch of entry.consonants) {
            map[ch] = entry.num;
        }
    }
    // Also map double consonants (쌍자음) to same digit as their base
    map['ㄲ'] = '1'; // ㄱ(1) family
    map['ㄸ'] = '3'; // ㄷ(3) family
    map['ㅃ'] = '4'; // ㅂ(4) family
    map['ㅆ'] = '5'; // ㅅ(5) family
    map['ㅉ'] = '6'; // ㅈ(6) family
    return map;
}

const CONSONANT_TO_DIGIT = buildConsonantToDigitMap();

/**
 * Convert a word (Korean / English / mixed) to a digit string
 * using Memit's mnemonic association system.
 *
 * Korean: 초성 추출 -> MNEMONIC_MAP reverse lookup
 *   예: "사랑" -> ㅅ(5) + ㄹ(2) -> "52"
 *   예: "가나다" -> ㄱ(1) + ㄴ(2) + ㄷ(3) -> "123"
 *
 * English: Phone keypad mapping
 *   예: "Love" -> 5(L) + 6(O) + 8(V) + 3(E) -> "5683"
 *
 * Numbers: Pass through as-is
 *   예: "123" -> "123"
 */
export function wordToNumbers(word: string): string {
    let result = '';
    for (const char of word) {
        // 1. If it's a digit, keep as-is
        if (/\d/.test(char)) {
            result += char;
            continue;
        }

        // 2. If it's a Korean syllable, extract 초성 and map
        const chosung = getChosung(char);
        if (chosung) {
            const digit = CONSONANT_TO_DIGIT[chosung];
            if (digit !== undefined) {
                result += digit;
            }
            continue;
        }

        // 3. If it's a standalone Korean consonant (ㄱ, ㄴ, etc.)
        if (CONSONANT_TO_DIGIT[char] !== undefined) {
            result += CONSONANT_TO_DIGIT[char];
            continue;
        }

        // 4. If it's English, use phone keypad
        const lower = char.toLowerCase();
        if (ENGLISH_KEYPAD[lower]) {
            result += ENGLISH_KEYPAD[lower];
            continue;
        }

        // 5. Skip other characters (spaces, special chars, etc.)
    }
    return result;
}

/**
 * Generate a PIN of the desired length from a word input.
 * If the word produces fewer digits than needed, it repeats/hashes to fill.
 * If it produces more, it truncates.
 */
export function generatePinFromWord(word: string, desiredLength: number): string {
    let digits = wordToNumbers(word);

    if (digits.length === 0) {
        // Fallback: hash the word to get digits
        const hash = djb2Hash(word);
        digits = hash.toString();
    }

    // If digits are shorter than desired, extend by hashing
    while (digits.length < desiredLength) {
        const extension = djb2Hash(word + digits).toString();
        digits += extension;
    }

    return digits.slice(0, desiredLength);
}

// Type definitions for the JSON data structure
interface DigitEntry {
    code: string;
    keywords: string[];
}

interface DigitsData {
    digits_2: DigitEntry[];
}

const typedDigitsData = digitsData as DigitsData;

// Image mapping interface
export interface MnemonicImage {
    number: string;
    keyword: string;
    imageUrl?: string; // Placeholder for future real images
}

export interface PasswordGenerationResult {
    password: string;
    images: MnemonicImage[];
    story: string;
}

/**
 * Simple deterministic hash function (DJB2 variant)
 * Returns a positive integer.
 */
function djb2Hash(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }
    return Math.abs(hash);
}

/**
 * Get Mnemonic Image for a 2-digit number
 */
export function getImagesForNumber(numStr: string): MnemonicImage {
    // Ensure 2 digits (padding if needed, though strictly we handle 2 digits)
    const code = numStr.padStart(2, '0').slice(-2);
    const entry = typedDigitsData.digits_2.find(d => d.code === code);

    // Deterministically pick one keyword based on the code itself (or random if we wanted, but let's stick to first for consistency or random for variety?)
    // For consistency in "Suggestion", we should pick the FIRST keyword or a specific one.
    // Let's pick the first one for now as the "canonical" image.
    const keyword = entry?.keywords[0] || 'Unknown';

    return {
        number: code,
        keyword: keyword,
        imageUrl: `/images/mnemonics/${code}.png` // Hypothetical path
    };
}

/**
 * Suggest a password based on Service Name + User Salt
 */
export async function suggestPassword(
    serviceName: string,
    userSalt: string,
    level: PasswordLevel,
    manualNumber?: string
): Promise<PasswordGenerationResult> {

    // 1. Create the Seed
    // If manual number is provided, use it. Otherwise, generate from hash.
    const seedString = (serviceName + userSalt).trim();
    const hash = djb2Hash(seedString);

    let coreNumbers: string[] = [];

    if (manualNumber) {
        // If manual number is 4 digits, split into 2 chunks
        // If 6 digits, 3 chunks, etc.
        // For simplicity, just chunk it by 2.
        const chunks = manualNumber.match(/.{1,2}/g) || [];
        coreNumbers = chunks.map(n => n.padEnd(2, '0')); // Ensure 2 chars
    } else {
        // Generate deterministic numbers 00-99 from hash
        // We need different numbers for different positions.
        const num1 = (hash % 100).toString().padStart(2, '0');
        const num2 = (djb2Hash(seedString + 'salt2') % 100).toString().padStart(2, '0');
        const num3 = (djb2Hash(seedString + 'salt3') % 100).toString().padStart(2, '0');
        const num4 = (djb2Hash(seedString + 'salt4') % 100).toString().padStart(2, '0');

        coreNumbers = [num1, num2, num3, num4];
    }

    // 2. Construct Password based on Level
    let password = '';
    let usedNumbers: string[] = [];

    // Safe visualizer function
    const sanitizeService = (name: string) => {
        if (!name) return '';
        // Capitalize first letter, remove spaces
        const trimmed = name.replace(/\s+/g, '');
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    };

    const cleanName = sanitizeService(serviceName);

    switch (level) {
        case 'L1_PIN':
            // PIN: Use the full manualNumber (already computed to desired length)
            if (manualNumber) {
                password = manualNumber;
                // Split into 2-digit chunks for mnemonic images
                usedNumbers = manualNumber.match(/.{1,2}/g) || [];
            } else {
                usedNumbers = coreNumbers.slice(0, 2);
                password = usedNumbers.join('');
            }
            break;

        case 'L2_WEB':
            // ServiceName + 4 digits + Special Char (! for standard)
            // Pattern: [Name][Num1][Num2]!
            // Wait, Standard plan said "6-digit". Let's use 3 numbers (6 digits).
            // Logic update: Plan said "6-digit". 
            usedNumbers = coreNumbers.slice(0, 3);
            password = `${cleanName}${usedNumbers.join('')}!`;
            break;

        case 'L3_MASTER':
            // Complex: Alternating Case ServiceName + 4 Digits + Special + 2 Digits ?
            // Plan: "8 digits + Special + Case"
            // Let's do: [MixedCaseName] + [Num1][Num2][Num3][Num4] + [Special]
            // We need a deterministic special char too? Let's use @ or # based on hash.

            // Mix case of name: 'Google' -> 'GoOgLe'
            const mixedCaseName = cleanName.split('').map((char, i) =>
                i % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
            ).join('');

            const specialChars = ['!', '@', '#', '$', '%', '*', '?'];
            const specialChar = specialChars[hash % specialChars.length];

            usedNumbers = coreNumbers.slice(0, 4); // 8 digits
            password = `${mixedCaseName}${specialChar}${usedNumbers.join('')}`;
            break;
    }

    // 3. Generate Visual Mnemonic Data
    const images = usedNumbers.map(num => getImagesForNumber(num));

    // 4. Generate Story (Simple Template for now)
    // "A [Keyword1] and [Keyword2] are [Action?]."
    // For MVP, just list keywords.
    const keywords = images.map(img => img.keyword);
    let story = '';

    if (keywords.length >= 2) {
        story = `${keywords[0]}`;
        for (let i = 1; i < keywords.length; i++) {
            story += `, ${keywords[i]}`;
        }
        story += '... 상상해보세요!';
    } else {
        story = `${keywords[0]}... 이미지를 떠올려보세요.`;
    }

    return {
        password,
        images,
        story
    };
}
