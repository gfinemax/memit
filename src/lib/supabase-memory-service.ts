import { createClient } from '@/utils/supabase/client';
import { MemoryService, SystemCodeMap, SystemType, UserMemory } from './memory-service';

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

    async saveMemory(memoryData: Omit<UserMemory, 'id' | 'created_at'>): Promise<UserMemory | null> {
        const supabase = createClient();
        if (!supabase) {
            console.error("Supabase client not initialized");
            return null;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error("No authenticated user found");
            return null;
        }

        // Proactively ensure profile exists to avoid FK errors
        try {
            await supabase.from('profiles').upsert({
                id: user.id,
                email: user.email,
                updated_at: new Date().toISOString()
            });
        } catch (e) {
            console.warn("Profile sync warning:", e);
        }

        const insertData = {
            user_id: user.id,
            input_data: memoryData.input_number,
            encoded_data: {
                story: memoryData.story,
                keywords: memoryData.keywords,
                strategy: memoryData.strategy
            },
            image_url: memoryData.image_url,
            metadata: {
                context: memoryData.context
            },
            source_type: 'AI_GENERATED'
        };

        const { data, error } = await supabase
            .from('memories')
            .insert(insertData)
            .select()
            .single();

        if (error || !data) {
            console.error("Save memory FAILED", {
                code: error?.code,
                message: error?.message,
                hint: error?.hint,
                details: error?.details
            });
            return null;
        }

        return {
            id: data.id,
            input_number: data.input_data,
            keywords: data.encoded_data.keywords,
            story: data.encoded_data.story,
            image_url: data.image_url,
            context: data.metadata?.context,
            strategy: data.encoded_data.strategy,
            created_at: data.created_at
        };
    }

    async getMemories(): Promise<UserMemory[]> {
        const supabase = createClient();
        if (!supabase) return [];

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('memories')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error || !data) {
            console.error("Get memories FAILED", error);
            return [];
        }

        return data.map(item => ({
            id: item.id,
            input_number: item.input_data,
            keywords: item.encoded_data?.keywords || [],
            story: item.encoded_data?.story || '',
            image_url: item.image_url,
            context: item.metadata?.context,
            strategy: item.encoded_data?.strategy || 'SCENE',
            created_at: item.created_at
        }));
    }

    async deleteMemory(id: string): Promise<boolean> {
        const supabase = createClient();
        if (!supabase) return false;

        const { error } = await supabase
            .from('memories')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Delete memory FAILED", error);
            return false;
        }

        return true;
    }
}

export const supabaseMemoryService = new SupabaseMemoryService();
