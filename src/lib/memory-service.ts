export type SystemType = '2D' | '3D';

export interface SystemCodeMap {
    id: string;
    type: SystemType;
    code: string;
    keywords: string[];
    description?: string;
}

export interface UserMemory {
    id?: string;
    input_number: string;
    keywords: string[];
    story: string;
    image_url?: string;
    context?: string;
    strategy: string;
    created_at?: string;
}

export interface MemoryService {
    getMapping(type: SystemType, code: string): Promise<SystemCodeMap | null>;
    searchKeywords(query: string): Promise<SystemCodeMap[]>;
    convertNumberToKeywords(number: string): Promise<string[]>;
    saveMemory(memory: Omit<UserMemory, 'id' | 'created_at'>): Promise<UserMemory | null>;
    getMemories(): Promise<UserMemory[]>;
    deleteMemory(id: string): Promise<boolean>;
}
