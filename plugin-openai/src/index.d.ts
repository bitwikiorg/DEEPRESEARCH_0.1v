import { OpenAI } from 'openai';
import type { ModelProviderName } from '../../core/src/types';
/**
 * OpenAI Plugin for COREAI
 * Provides integration with OpenAI's API for text generation and embedding
 */
declare const openaiPlugin: {
    name: string;
    description: string;
    initialize: (config: any) => Promise<{
        success: boolean;
        client: OpenAI;
        provider: ModelProviderName;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        client?: undefined;
        provider?: undefined;
    }>;
    generateText: (client: any, prompt: any, modelClass: any, options?: {}) => Promise<{
        success: boolean;
        text: any;
        usage: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        text?: undefined;
        usage?: undefined;
    }>;
    generateEmbedding: (client: any, text: any) => Promise<{
        success: boolean;
        embedding: any;
        usage: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        embedding?: undefined;
        usage?: undefined;
    }>;
};
export default openaiPlugin;
//# sourceMappingURL=index.d.ts.map