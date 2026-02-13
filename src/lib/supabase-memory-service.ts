import { createClient } from '@/utils/supabase/client';
import { MemoryService, SystemCodeMap, SystemType } from './memory-service';

export class SupabaseMemoryService implements MemoryService {
    async getMapping(type: SystemType, code: string): Promise<SystemCodeMap | null> {
        const supabase = createClient();
        if (!supabase) return null;

        // Get user session to check for overrides
        const { data: { user } } = await supabase.auth.getUser();

        // Query prioritizing user custom rows (Layered logic)
        // Ordering by user_id NULLS LAST to get the user's override first if it exists
        const { data, error } = await supabase
            .from('system_code_maps')
            .select('*')
            .eq('type', type)
            .eq('code', code)
            .or(`user_id.is.null,user_id.eq.${user?.id || '00000000-0000-0000-0000-000000000000'}`)
            .order('user_id', { ascending: false, nullsFirst: false })
            .limit(1)
            .single();

        if (error || !data) return null;

        return {
            id: data.id,
            type: data.type as SystemType,
            code: data.code,
            keywords: data.keywords as string[],
            description: data.description
        };
    }

    async searchKeywords(query: string): Promise<SystemCodeMap[]> {
        const supabase = createClient();
        if (!supabase) return [];

        const { data: { user } } = await supabase.auth.getUser();

        // This is a complex query to handle layering in keyword search
        // For now, we fetch both and deduplicate in code or use a clever query
        const { data, error } = await supabase
            .from('system_code_maps')
            .select('*')
            .contains('keywords', [query]) // Simple contains check
            .or(`user_id.is.null,user_id.eq.${user?.id || '00000000-0000-0000-0000-000000000000'}`);

        if (error || !data) return [];

        // Deduplicate: User override wins
        const resultMap = new Map<string, any>();
        data.forEach(item => {
            const key = `${item.type}-${item.code}`;
            if (!resultMap.has(key) || item.user_id !== null) {
                resultMap.set(key, item);
            }
        });

        return Array.from(resultMap.values()).map(item => ({
            id: item.id,
            type: item.type as SystemType,
            code: item.code,
            keywords: item.keywords as string[],
            description: item.description
        }));
    }

    async convertNumberToKeywords(number: string): Promise<string[]> {
        const result: string[] = [];
        let remaining = number.replace(/[^0-9]/g, '');

        while (remaining.length > 0) {
            let match: SystemCodeMap | null = null;

            // Try 3 digits
            if (remaining.length >= 3) {
                const chunk = remaining.substring(0, 3);
                match = await this.getMapping('3D', chunk);
                if (match) {
                    result.push(match.keywords[0]);
                    remaining = remaining.substring(3);
                    continue;
                }
            }

            // Try 2 digits
            if (remaining.length >= 2) {
                const chunk = remaining.substring(0, 2);
                match = await this.getMapping('2D', chunk);
                if (match) {
                    result.push(match.keywords[0]);
                    remaining = remaining.substring(2);
                    continue;
                }
            }

            // Fallback for 1 digit
            if (remaining.length === 1) {
                const chunk = '0' + remaining;
                match = await this.getMapping('2D', chunk);
                if (match) {
                    result.push(match.keywords[0]);
                }
                remaining = remaining.substring(1);
                continue;
            }

            remaining = remaining.substring(1);
        }

        return result;
    }
}

export const supabaseMemoryService = new SupabaseMemoryService();
