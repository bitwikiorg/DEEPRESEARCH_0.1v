import { OpenAI } from 'openai';
import { character } from './character';
/**
 * Terminal AI Connector
 *
 * This module connects the Eliza character definition with the OpenAI plugin
 * for the terminal AI chat interface.
 */
export async function initializeOpenAI() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error('OpenAI API key not found');
        return null;
    }
    try {
        return new OpenAI({ apiKey });
    }
    catch (error) {
        console.error('Failed to initialize OpenAI client:', error);
        return null;
    }
}
export async function generateTerminalResponse(client, userMessage, userName = 'User') {
    if (!client) {
        return { error: 'OpenAI client not initialized' };
    }
    try {
        // Build conversation context from character definition
        const systemPrompt = character.system;
        const styleInstructions = character.style.chat.join('\n');
        // Format example messages in OpenAI format
        const exampleMessages = character.messageExamples.length > 0
            ? character.messageExamples[0].map(msg => ({
                role: msg.user === 'Eliza' ? 'assistant' : 'user',
                content: msg.content.text
            }))
            : [];
        // Build the complete message array
        const messages = [
            {
                role: 'system',
                content: `${systemPrompt}\n\nStyle guidelines:\n${styleInstructions}`
            },
            ...exampleMessages,
            { role: 'user', content: userMessage }
        ];
        // Call OpenAI API
        const completion = await client.chat.completions.create({
            model: 'gpt-4o-mini', // You can customize this based on settings
            messages,
            temperature: 0.7,
            max_tokens: 500
        });
        return { text: completion.choices[0].message.content };
    }
    catch (error) {
        console.error('Error generating terminal response:', error);
        return { error: `Failed to generate response: ${error.message}` };
    }
}
