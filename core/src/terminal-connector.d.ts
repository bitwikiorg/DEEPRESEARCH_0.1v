import { OpenAI } from 'openai';
/**
 * Terminal AI Connector
 *
 * This module connects the Eliza character definition with the OpenAI plugin
 * for the terminal AI chat interface.
 */
export declare function initializeOpenAI(): Promise<OpenAI | null>;
export declare function generateTerminalResponse(client: any, userMessage: any, userName?: string): Promise<{
    error: string;
    text?: undefined;
} | {
    text: any;
    error?: undefined;
}>;
//# sourceMappingURL=terminal-connector.d.ts.map