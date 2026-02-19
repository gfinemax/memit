// No external crypto dependency needed — using a simple deterministic hash for verification.
// This is NOT for security (passwords aren't stored). It's only to confirm the user can recall the input string.

// Korean to English Keyboard Map (2-Set / QWERTY)
const KOR_TO_ENG_MAP: { [key: string]: string } = {
    'ㅂ': 'q', 'ㅈ': 'w', 'ㄷ': 'e', 'ㄱ': 'r', 'ㅅ': 't', 'ㅛ': 'y', 'ㅕ': 'u', 'ㅑ': 'i', 'ㅐ': 'o', 'ㅔ': 'p',
    'ㅁ': 'a', 'ㄴ': 's', 'ㅇ': 'd', 'ㄹ': 'f', 'ㅎ': 'g', 'ㅗ': 'h', 'ㅓ': 'j', 'ㅏ': 'k', 'ㅣ': 'l',
    'ㅋ': 'z', 'ㅌ': 'x', 'ㅊ': 'c', 'ㅍ': 'v', 'ㅠ': 'b', 'ㅜ': 'n', 'ㅡ': 'm',
    'ㅃ': 'Q', 'ㅉ': 'W', 'ㄸ': 'E', 'ㄲ': 'R', 'ㅆ': 'T', 'ㅒ': 'O', 'ㅖ': 'P'
};

// Double Jamo decomposition map (e.g., ㅘ -> h + k)
const COMPLEX_JAMO_MAP: { [key: string]: string } = {
    'ㅘ': 'hk', 'ㅙ': 'ho', 'ㅚ': 'hl', 'ㅝ': 'nj', 'ㅞ': 'np', 'ㅟ': 'nl', 'ㅢ': 'ml'
};

// Cho-sung (Initial consonants) generic mapping for quick extraction
const CHOSUNG_LIST = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

export interface PasswordOptions {
    includeSpecial?: boolean;
    includeNumber?: boolean;
    useLeet?: boolean; // e.g. a -> @
    useKoreanMap?: boolean; // e.g. 홍길동 -> ghdrlfehd
    length?: number; // Minimum length
    salt?: string; // User's personal signature (e.g. "!!")
}

/**
 * Checks if a character is a Korean character
 */
function isKorean(char: string): boolean {
    const code = char.charCodeAt(0);
    return (code >= 0xAC00 && code <= 0xD7A3) || (code >= 0x3130 && code <= 0x318F);
}

/**
 * Decomposes a Hangul syllable into Jamos and maps to English QWERTY
 * Simplified implementation: Generally maps the keystrokes.
 */
function convertHangulCharToEng(char: string): string {
    if (!isKorean(char)) return char;

    const code = char.charCodeAt(0);
    // Hangul Syllables Area
    if (code >= 0xAC00 && code <= 0xD7A3) {
        return resolveHangulToEnglish(char);
    }
    return KOR_TO_ENG_MAP[char] || char;
}

/**
 * Robust Hangul to English keystroke converter
 */
function resolveHangulToEnglish(char: string): string {
    return "TEMP_IMPL"; // Placeholder to signal we need better logic or lib.
}

// Re-implementing a small Hangul disassemble for key mapping
// Constants for Hangul decomposition
const SBase = 0xAC00;
const LBase = 0x1100;
const VBase = 0x1161;
const TBase = 0x11A7;
const LCount = 19;
const VCount = 21;
const TCount = 28;
const NCount = VCount * TCount;
const SCount = LCount * NCount;

const LChars = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
const VChars = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
const TChars = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

const ENG_KEY_MAP: Record<string, string> = {
    'ㄱ': 'r', 'ㄲ': 'R', 'ㄴ': 's', 'ㄷ': 'e', 'ㄸ': 'E', 'ㄹ': 'f', 'ㅁ': 'a', 'ㅂ': 'q', 'ㅃ': 'Q', 'ㅅ': 't', 'ㅆ': 'T', 'ㅇ': 'd', 'ㅈ': 'w', 'ㅉ': 'W', 'ㅊ': 'c', 'ㅋ': 'z', 'ㅌ': 'x', 'ㅍ': 'v', 'ㅎ': 'g',
    'ㅏ': 'k', 'ㅐ': 'o', 'ㅑ': 'i', 'ㅒ': 'O', 'ㅓ': 'j', 'ㅔ': 'p', 'ㅕ': 'u', 'ㅖ': 'P', 'ㅗ': 'h', 'ㅘ': 'hk', 'ㅙ': 'ho', 'ㅚ': 'hl', 'ㅛ': 'y', 'ㅜ': 'n', 'ㅝ': 'nj', 'ㅞ': 'np', 'ㅟ': 'nl', 'ㅠ': 'b', 'ㅡ': 'm', 'ㅢ': 'ml', 'ㅣ': 'l',
    'ㄳ': 'rt', 'ㄵ': 'sw', 'ㄶ': 'sg', 'ㄺ': 'fr', 'ㄻ': 'fa', 'ㄼ': 'fq', 'ㄽ': 'ft', 'ㄾ': 'fx', 'ㄿ': 'fv', 'ㅀ': 'fg', 'ㅄ': 'qt'
};

function disassembleHangul(char: string): string[] {
    const code = char.charCodeAt(0);
    if (code >= SBase && code < SBase + SCount) {
        const SIndex = code - SBase;
        const L = Math.floor(SIndex / NCount);
        const V = Math.floor((SIndex % NCount) / TCount);
        const T = SIndex % TCount;
        const jamos = [LChars[L], VChars[V]];
        if (T > 0) jamos.push(TChars[T]);
        return jamos;
    }
    return [char];
}

function mapToEnglishKeys(text: string): string {
    let result = '';
    for (const char of text) {
        if (isKorean(char)) {
            const jamos = disassembleHangul(char);
            for (const jamo of jamos) {
                result += ENG_KEY_MAP[jamo] || jamo;
            }
        } else {
            result += ENG_KEY_MAP[char] || char; // Check map just in case standalone jamo
        }
    }
    return result;
}

/**
 * Main Generator Function
 */
export function generateMnemonicPassword(input: string, options: PasswordOptions = {}): string {
    let result = input.trim();

    // 1. Korean Mapping (Highest Priority transform)
    if (options.useKoreanMap) {
        result = mapToEnglishKeys(result);
    }

    // 2. Leet Speak (if enabled)
    if (options.useLeet) {
        result = result
            .replace(/a/gi, '@')
            .replace(/e/gi, '3')
            .replace(/i/gi, '1')
            .replace(/s/gi, '$')
            .replace(/o/gi, '0')
            .replace(/t/gi, '7');
    }

    // 3. Length Constraint (Simple padding if short)
    if (options.length && result.length < options.length) {
        const pad = options.salt || "123!";
        while (result.length < options.length) {
            result += pad;
        }
    }

    // 4. Add Salt (Signature)
    if (options.salt) {
        result += options.salt;
    }

    // 5. Special Chars & Numbers Enforcement (Simple Append if missing)
    if (options.includeSpecial && !/[!@#$%^&*]/.test(result)) {
        result += '!';
    }
    if (options.includeNumber && !/[0-9]/.test(result)) {
        result += '1';
    }

    return result;
}

/**
 * Generate Verification Hash (Simple deterministic hash)
 * This is only used to confirm a user can recall their mnemonic sentence.
 * NOT used for cryptographic security — the password itself is never stored.
 */
export function generateVerificationHash(password: string): string {
    // Simple, fast, deterministic hash (djb2 variant + base36)
    let hash = 5381;
    for (let i = 0; i < password.length; i++) {
        hash = ((hash << 5) + hash) + password.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit int
    }
    // Return as hex-like string for readability
    return Math.abs(hash).toString(36) + '-' + password.length.toString(36);
}

/**
 * Extract Initials (Cho-sung) for simple mode
 */
export function extractInitials(text: string): string {
    let result = '';
    for (const char of text) {
        if (isKorean(char)) {
            const code = char.charCodeAt(0);
            if (code >= SBase && code < SBase + SCount) {
                const L = Math.floor((code - SBase) / NCount);
                result += ENG_KEY_MAP[LChars[L]] || '';
            } else {
                result += ENG_KEY_MAP[char] || char;
            }
        } else {
            // For English, take first letter of words? 
            // The functionality description says "First letter".
            // If the input is a sentence "I Love You", initials are "ILY".
            // If it's a word-flow, we assume the user processes word by word?
            // Let's stick to character-based unless spaces are involved.
            // If space, we might imply word splitting.
            result += char;
        }
    }
    // If spaces existed, maybe reduce to initials?
    // "I Love You" -> "ILY"
    if (text.includes(' ')) {
        return text.split(' ').map(w => w[0]).join('');
    }
    return result;
}
