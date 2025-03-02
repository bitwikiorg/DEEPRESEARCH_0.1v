export interface OpenAITextRequest {
    model: string;
    prompt: string;
    max_tokens: number;
    temperature: number;
}
export interface OpenAITextResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        text: string;
        index: number;
        logprobs: null | {
            tokens: string[];
            token_logprobs: number[];
            top_logprobs: Record<string, number>[];
            text_offset: number[];
        };
        finish_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}
export interface OpenAIEmbeddingRequest {
    model: string;
    input: string | string[];
}
export interface OpenAIEmbeddingResponse {
    object: string;
    data: Array<{
        embedding: number[];
        index: number;
    }>;
    model: string;
    usage: {
        prompt_tokens: number;
        total_tokens: number;
    };
}
export interface OpenAISentimentAnalysisRequest {
    model: string;
    prompt: string;
    max_tokens: number;
    temperature: number;
}
export interface OpenAISentimentAnalysisResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        text: string;
        index: number;
        logprobs: null | {
            tokens: string[];
            token_logprobs: number[];
            top_logprobs: Record<string, number>[];
            text_offset: number[];
        };
        finish_reason: string;
    }>;
}
export interface OpenAITranscriptionRequest {
    file: File | Blob;
    model: string;
    prompt?: string;
    response_format?: "json" | "text" | "srt" | "verbose_json" | "vtt";
    temperature?: number;
    language?: string;
}
export interface OpenAITranscriptionResponse {
    text: string;
}
export interface OpenAIModerationRequest {
    input: string | string[];
    model?: string;
}
export interface OpenAIModerationResponse {
    id: string;
    model: string;
    results: Array<{
        flagged: boolean;
        categories: Record<string, boolean>;
        category_scores: Record<string, number>;
    }>;
}
export interface OpenAIEditRequest {
    model: string;
    input: string;
    instruction: string;
    temperature?: number;
    top_p?: number;
}
export interface OpenAIEditResponse {
    object: string;
    created: number;
    choices: Array<{
        text: string;
        index: number;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}
//# sourceMappingURL=types.d.ts.map