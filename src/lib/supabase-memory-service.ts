import { createClient } from '@/utils/supabase/client';
import { MemoryService, SystemCodeMap, SystemType, UserMemory } from './memory-service';

export class SupabaseMemoryService implements MemoryService {
    async getMapping(type: SystemType, code: string): Promise<SystemCodeMap | null> {
        const supabase = createClient();
        if (!supabase) return null;

        const { data: { user } } = await supabase.auth.getUser();

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

        const { data, error } = await supabase
            .from('system_code_maps')
            .select('*')
            .contains('keywords', [query])
            .or(`user_id.is.null,user_id.eq.${user?.id || '00000000-0000-0000-0000-000000000000'}`);

        if (error || !data) return [];

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
            if (remaining.length >= 3) {
                const chunk = remaining.substring(0, 3);
                match = await this.getMapping('3D', chunk);
                if (match) {
                    result.push(match.keywords[0]);
                    remaining = remaining.substring(3);
                    continue;
                }
            }
            if (remaining.length >= 2) {
                const chunk = remaining.substring(0, 2);
                match = await this.getMapping('2D', chunk);
                if (match) {
                    result.push(match.keywords[0]);
                    remaining = remaining.substring(2);
                    continue;
                }
            }
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

        try {
            await supabase.from('profiles').upsert({
                id: user.id,
                email: user.email,
                updated_at: new Date().toISOString()
            });
        } catch (e) {
            console.warn("Profile sync warning:", e);
        }

        let finalImageUrl = memoryData.image_url;
        const isExternalUrl = (finalImageUrl?.startsWith('http') || finalImageUrl?.startsWith('data:')) &&
            !finalImageUrl.includes('.supabase.co/storage/v1/object/public/');

        if (isExternalUrl) {
            const fileName = `${user.id}/${Date.now()}.png`;
            const uploadedUrl = await this.uploadImage(finalImageUrl!, fileName);
            if (uploadedUrl) {
                finalImageUrl = uploadedUrl;
            }
        }

        const insertData = {
            user_id: user.id,
            input_data: memoryData.input_number,
            encoded_data: {
                story: memoryData.story,
                keywords: memoryData.keywords,
                strategy: memoryData.strategy
            },
            image_url: finalImageUrl,
            metadata: {
                context: memoryData.context,
                category: memoryData.category,
                isFavorite: memoryData.isFavorite || false
            },
            source_type: 'AI_GENERATED'
        };

        const { data, error } = await supabase
            .from('memories')
            .insert(insertData)
            .select()
            .single();

        if (error || !data) {
            console.error("Save memory FAILED", error);
            return null;
        }

        return {
            id: data.id,
            input_number: data.input_data,
            keywords: data.encoded_data.keywords,
            story: data.encoded_data.story,
            image_url: data.image_url,
            context: data.metadata?.context,
            category: data.metadata?.category,
            isFavorite: data.metadata?.isFavorite || false,
            strategy: data.encoded_data.strategy,
            created_at: data.created_at
        };
    }

    async uploadImage(url: string, path: string): Promise<string | null> {
        const supabase = createClient();
        if (!supabase) {
            console.error("Supabase client not found in uploadImage");
            return null;
        }

        const BUCKET_NAME = 'memory-images';

        try {
            console.log(`Attempting to persist image: ${url.startsWith('data:') ? 'Base64/DataURL' : url} -> ${path}`);
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Failed to fetch remote image: ${response.status} ${response.statusText}`);
                throw new Error('Failed to fetch image');
            }
            const blob = await response.blob();
            console.log(`Image fetched successfully. Size: ${blob.size} bytes`);

            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(path, blob, {
                    contentType: 'image/png',
                    upsert: true
                });

            if (error) {
                console.error("Supabase Storage upload error:", error);
                if (error.message.includes('bucket not found')) {
                    console.error(`CRITICAL: '${BUCKET_NAME}' bucket is missing in Supabase!`);
                }
                throw error;
            }

            const { data: { publicUrl } } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(path);

            console.log(`Image persisted successfully. Public URL: ${publicUrl}`);
            return publicUrl;
        } catch (error) {
            console.error("Image persistence pipeline FAILED", error);
            return null;
        }
    }

    async getMemories(): Promise<UserMemory[]> {
        const supabase = createClient();
        if (!supabase) return [];

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('memories')
            .select('*')
            .is('deleted_at', null)
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
            category: item.metadata?.category,
            isFavorite: item.metadata?.isFavorite || false,
            label: item.metadata?.label || '',
            strategy: item.encoded_data?.strategy || 'SCENE',
            created_at: item.created_at
        }));
    }

    async deleteMemory(id: string): Promise<{ success: boolean; error?: string }> {
        const supabase = createClient();
        if (!supabase) return { success: false, error: 'Supabase not initialized' };

        const { error } = await supabase
            .from('memories')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            console.error("Delete memory (soft) FAILED", error);
            return { success: false, error: error.message };
        }

        return { success: true };
    }

    async updateMemoryLabel(id: string, label: string): Promise<{ success: boolean; error?: string }> {
        const supabase = createClient();
        if (!supabase) return { success: false, error: 'Supabase not initialized' };

        // First get current metadata
        const { data: memory, error: fetchError } = await supabase
            .from('memories')
            .select('metadata')
            .eq('id', id)
            .single();

        if (fetchError || !memory) {
            return { success: false, error: fetchError?.message || 'Memory not found' };
        }

        const updatedMetadata = { ...memory.metadata, label };

        const { error } = await supabase
            .from('memories')
            .update({ metadata: updatedMetadata })
            .eq('id', id);

        if (error) {
            console.error('Update label FAILED', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    }

    async toggleFavorite(id: string, isFavorite: boolean): Promise<{ success: boolean; error?: string }> {
        const supabase = createClient();
        if (!supabase) return { success: false, error: 'Supabase not initialized' };

        const { data: memory, error: fetchError } = await supabase
            .from('memories')
            .select('metadata')
            .eq('id', id)
            .single();

        if (fetchError || !memory) {
            return { success: false, error: fetchError?.message || 'Memory not found' };
        }

        const newMetadata = {
            ...(memory.metadata || {}),
            isFavorite: isFavorite
        };

        const { error: updateError } = await supabase
            .from('memories')
            .update({ metadata: newMetadata })
            .eq('id', id);

        if (updateError) return { success: false, error: updateError.message };
        return { success: true };
    }
}

export const supabaseMemoryService = new SupabaseMemoryService();
