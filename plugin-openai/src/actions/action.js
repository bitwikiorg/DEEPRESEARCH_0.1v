import axios from "axios";
export const DEFAULT_MODEL = process.env.OPENAI_DEFAULT_MODEL || "text-davinci-003";
export const DEFAULT_MAX_TOKENS = Number.parseInt(process.env.OPENAI_MAX_TOKENS || "200", 10);
export const DEFAULT_TEMPERATURE = Number.parseFloat(process.env.OPENAI_TEMPERATURE || "0.7");
export const DEFAULT_TIMEOUT = 30000; // 30 seconds
/**
 * Validate a prompt for length and content.
 * @param prompt - The prompt to validate.
 * @throws Will throw an error if the prompt is invalid.
 */
export function validatePrompt(prompt) {
    if (!prompt.trim()) {
        throw new Error("Prompt cannot be empty");
    }
    if (prompt.length > 4000) {
        throw new Error("Prompt exceeds maximum length of 4000 characters");
    }
}
/**
 * Validate the presence of the OpenAI API key.
 * @throws Will throw an error if the API key is not set.
 * @returns The API key.
 */
export function validateApiKey() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OpenAI API key is not set");
    }
    return apiKey;
}
export async function callOpenAiApi(url, data, apiKey) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            timeout: DEFAULT_TIMEOUT,
        };
        const response = await axios.post(url, data, config);
        return response.data;
    }
    catch (error) {
        console.error("Error communicating with OpenAI API:", error instanceof Error ? error.message : String(error));
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 429) {
                throw new Error("Rate limit exceeded. Please try again later.");
            }
        }
        throw new Error("Failed to communicate with OpenAI API");
    }
}
/**
 * Build a request object for OpenAI completions.
 * @param prompt - The text prompt to process.
 * @param model - The model to use.
 * @param maxTokens - The maximum number of tokens to generate.
 * @param temperature - The sampling temperature.
 * @returns The request payload for OpenAI completions.
 */
export function buildRequestData(prompt, model = DEFAULT_MODEL, maxTokens = DEFAULT_MAX_TOKENS, temperature = DEFAULT_TEMPERATURE) {
    return {
        model,
        prompt,
        max_tokens: maxTokens,
        temperature,
    };
}
