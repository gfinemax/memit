export type SystemType = '2D' | '3D';

export interface SystemCodeMap {
    id: string;
    type: SystemType;
    code: string;
    keywords: string[];
    description?: string;
}

export interface MemoryService {
    getMapping(type: SystemType, code: string): Promise<SystemCodeMap | null>;
    searchKeywords(query: string): Promise<SystemCodeMap[]>;
    convertNumberToKeywords(number: string): Promise<string[]>;
}
