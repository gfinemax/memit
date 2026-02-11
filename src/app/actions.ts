'use server';

import { memoryService } from '@/lib/local-memory-service';

export async function convertNumberAction(number: string) {
    if (!number) return { success: false, error: 'Input is empty' };

    try {
        const keywords = await memoryService.convertNumberToKeywords(number);
        return { success: true, data: keywords };
    } catch (error) {
        console.error("Conversion error:", error);
        return { success: false, error: 'Conversion failed' };
    }
}
