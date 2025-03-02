export declare const DEFAULT_MODEL: string;
export declare const DEFAULT_MAX_TOKENS: number;
export declare const DEFAULT_TEMPERATURE: number;
export declare const DEFAULT_TIMEOUT = 30000;
/**
 * Validate a prompt for length and content.
 * @param prompt - The prompt to validate.
 * @throws Will throw an error if the prompt is invalid.
 */
export declare function validatePrompt(prompt: string): void;
/**
 * Validate the presence of the OpenAI API key.
 * @throws Will throw an error if the API key is not set.
 * @returns The API key.
 */
export declare function validateApiKey(): string;
/**
 * Send a request to the OpenAI API.
 * @param url - The OpenAI API endpoint.
 * @param data - The request payload.
 * @returns The response data.
 * @throws Will throw an error for request failures or rate limits.
 */
export interface OpenAIRequestData {
    model: string;
    prompt: string;
    max_tokens: number;
    temperature: number;
    [key: string]: unknown;
}
export interface OpenAIEditRequestData {
    model: string;
    input: string;
    instruction: string;
    max_tokens: number;
    temperature: number;
    [key: string]: unknown;
}
export declare function callOpenAiApi<T>(url: string, data: OpenAIRequestData | OpenAIEditRequestData, apiKey: string): Promise<T>;
/**
 * Build a request object for OpenAI completions.
 * @param prompt - The text prompt to process.
 * @param model - The model to use.
 * @param maxTokens - The maximum number of tokens to generate.
 * @param temperature - The sampling temperature.
 * @returns The request payload for OpenAI completions.
 */
export declare function buildRequestData(prompt: string, model?: string, maxTokens?: number, temperature?: number): OpenAIRequestData;
//# sourceMappingURL=action.d.ts.map