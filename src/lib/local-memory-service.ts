import { MemoryService, SystemCodeMap, SystemType, UserMemory, KeywordResult } from './memory-service';
import digits2Data from '../../digits_2_full.json';
import digits3Data from '../../digits_3_full.json';

// Define types that match the JSON structure
interface DigitEntry {
    code: string;
    keywords: string[];
    location?: string;
}

interface JsonData2 {
    digits_2: DigitEntry[];
}

interface JsonData3 {
    digits_3: DigitEntry[];
}

const digits2 = (digits2Data as JsonData2).digits_2;
const digits3 = (digits3Data as JsonData3).digits_3;

export class LocalMemoryService implements MemoryService {
    async getMapping(type: SystemType, code: string): Promise<SystemCodeMap | null> {
        // In a real async scenario (DB), this would be awaitable.
        // For local JSON, we just find it.
        let entry: DigitEntry | undefined;

        if (type === '2D') {
            entry = digits2.find(d => d.code === code);
        } else {
            entry = digits3.find(d => d.code === code);
        }

        if (!entry) return null;

        return {
            id: code, // Use code as ID for local mock
            type,
            code: entry.code,
            keywords: entry.keywords,
            description: entry.location
        };
    }

    async searchKeywords(query: string): Promise<SystemCodeMap[]> {
        const results: SystemCodeMap[] = [];
        const lowerQuery = query.toLowerCase();

        // Search in 2D
        digits2.forEach(d => {
            if (d.keywords.some(k => k.includes(lowerQuery))) {
                results.push({
                    id: d.code,
                    type: '2D',
                    code: d.code,
                    keywords: d.keywords,
                    description: d.location
                });
            }
        });

        // Search in 3D
        digits3.forEach(d => {
            if (d.keywords.some(k => k.includes(lowerQuery))) {
                results.push({
                    id: d.code,
                    type: '3D',
                    code: d.code,
                    keywords: d.keywords
                });
            }
        });

        return results;
    }

    async convertNumberToKeywords(number: string): Promise<KeywordResult[]> {
        const result: KeywordResult[] = [];
        let remaining = number.replace(/[^0-9]/g, '');

        while (remaining.length > 0) {
            let match: SystemCodeMap | null = null;
            let chunk = '';

            // Try 3 digits
            if (remaining.length >= 3) {
                chunk = remaining.substring(0, 3);
                match = await this.getMapping('3D', chunk);
                if (match) {
                    result.push({
                        word: match.keywords[0],
                        code: chunk,
                        candidates: match.keywords
                    });
                    remaining = remaining.substring(3);
                    continue;
                }
            }

            // Try 2 digits
            if (remaining.length >= 2) {
                chunk = remaining.substring(0, 2);
                match = await this.getMapping('2D', chunk);
                if (match) {
                    result.push({
                        word: match.keywords[0],
                        code: chunk,
                        candidates: match.keywords
                    });
                    remaining = remaining.substring(2);
                    continue;
                }
            }

            // Fallback for single digit
            if (remaining.length === 1) {
                chunk = '0' + remaining;
                match = await this.getMapping('2D', chunk);
                if (match) {
                    result.push({
                        word: match.keywords[0],
                        code: chunk,
                        candidates: match.keywords
                    });
                }
                remaining = remaining.substring(1);
                continue;
            }

            remaining = remaining.substring(1);
        }

        return result;
    }

    async saveMemory(memoryData: Omit<UserMemory, 'id' | 'created_at'>): Promise<UserMemory | null> {
        console.log("Mock saved memory:", memoryData);
        return {
            ...memoryData,
            id: 'mock-id-' + Date.now(),
            created_at: new Date().toISOString()
        };
    }

    async toggleFavorite(id: string, isFavorite: boolean): Promise<boolean> {
        return true;
    }

    async deleteMemory(id: string): Promise<{ success: boolean; error?: string }> {
        return { success: true };
    }

    async updateMemoryLabel(id: string, label: string): Promise<{ success: boolean; error?: string }> {
        return { success: true };
    }

    async uploadImage(url: string, path: string): Promise<string | null> {
        return url;
    }

    async getMemories(): Promise<UserMemory[]> {
        return [];
    }
}

export const memoryService = new LocalMemoryService();
