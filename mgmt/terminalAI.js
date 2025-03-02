import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import axios from 'axios';

// Set up __dirname equivalent for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Venice API client
let veniceClient = null;

/**
 * Fetch available models from Venice API
 * @returns {Promise<Array>} List of available models
 */
export async function fetchAvailableModels() {
  try {
    if (!veniceClient) {
      await initializeTerminalAI();
      if (!veniceClient) {
        return { success: false, error: "Unable to initialize AI system" };
      }
    }

    const veniceApiKey = process.env.VENICE_API_KEY;

    const response = await axios.get('https://api.venice.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${veniceApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Venice models API response:', response.status);
    console.log('Venice models data:', JSON.stringify(response.data, null, 2));

    // Handle the actual structure of the API response
    const models = response.data.data || [];

    return {
      success: true,
      models: models
    };
  } catch (error) {
    console.error('Error fetching Venice models:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
}

/**
 * Initialize the Terminal AI system with Venice API
 * @returns {Promise<boolean>} Success status
 */
export async function initializeTerminalAI() {
  try {
    const veniceApiKey = process.env.VENICE_API_KEY;

    if (!veniceApiKey) {
      console.error('Venice API key is not set in environment variables');
      return false;
    }

    console.log('Initializing Venice client with API key:', veniceApiKey.substring(0, 4) + '...');

    // Initialize the Venice API client
    veniceClient = {
      apiKey: veniceApiKey,
      baseUrl: 'https://api.venice.ai/api/v1',
      generateText: async (prompt, options = {}) => {
        try {
          console.log('Making request to Venice API...');

          const requestBody = {
            model: options.model || 'llama-3.3-70b', // Default model
            messages: [{ role: 'user', content: prompt }],
            max_tokens: options.maxTokens || 500,
            temperature: options.temperature || 0.7,
            venice_parameters: {
              include_venice_system_prompt: true
            }
          };

          const response = await axios.post(
            `${veniceClient.baseUrl}/chat/completions`, 
            requestBody, 
            {
              headers: {
                'Authorization': `Bearer ${veniceApiKey}`,
                'Content-Type': 'application/json'
              },
              timeout: 30000 // 30 second timeout
            }
          );

          console.log('Venice API response status:', response.status);
          return {
            success: true,
            text: response.data.choices[0].message.content,
            reasoning: response.data.choices[0].message.reasoning_content || 
                      (response.data.choices[0].message.content.includes('<think>') ? 
                      response.data.choices[0].message.content.match(/<think>([\s\S]*?)<\/think>/)?.[1] : null)
          };
        } catch (error) {
          console.error('Venice API error:', error.response?.data || error.message);

          // Handle specific Venice API error codes
          if (error.response?.status === 401) {
            return {
              success: false,
              error: 'Authentication failed. Check your Venice API key.'
            };
          } else if (error.response?.status === 429) {
            return {
              success: false,
              error: 'Rate limit exceeded. Please try again later.'
            };
          }

          return {
            success: false,
            error: error.response?.data?.message || error.message
          };
        }
      }
    };

    console.log('Terminal AI system initialized successfully with Venice API');
    return true;
  } catch (error) {
    console.error('Error initializing Terminal AI with Venice:', error);
    return false;
  }
}

/**
 * Process a message from the terminal interface
 * @param {string} message - The user's message
 * @param {Array} history - Chat history for context
 * @returns {Promise<object>} The AI response
 */
export async function processTerminalMessage(message, history = []) {
  try {
    console.log(`Processing terminal AI message: "${message}"`);

    // Check if Venice client is initialized
    if (!veniceClient) {
      await initializeTerminalAI();
      if (!veniceClient) {
        return {
          success: false,
          response: "Unable to initialize AI system. Please check your API configuration."
        };
      }
    }

    // Format history for the API
    const formattedHistory = history.map(msg => ({
      role: msg.role || (msg.isUser ? 'user' : 'assistant'),
      content: msg.content || msg.text
    }));

    // Prepare the prompt with system instructions
    const systemPrompt = "You are an AI assistant in a terminal interface. Provide helpful, concise responses.";
    const messages = [
      { role: 'system', content: systemPrompt },
      ...formattedHistory,
      { role: 'user', content: message }
    ];

    // Make the API request
    try {
      const response = await veniceClient.generateText(message, {
        model: 'deepseek-r1-671b',
        temperature: 0.7,
        maxTokens: 800
      });

      if (response.success) {
        return {
          success: true,
          response: response.text,
          reasoning: response.reasoning || null
        };
      } else {
        return {
          success: false,
          response: `Error: ${response.error || 'Unknown error from AI service'}`
        };
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      return {
        success: false,
        response: `Error: ${error.message}`
      };
    }
  } catch (error) {
    console.error('Error processing terminal message:', error);
    return {
      success: false,
      response: `Error: ${error.message}`
    };
  }
}

/**
 * Process a character-based chat message 
 * @param {string} message - User message
 * @param {string} character - Character profile to use
 * @param {Array} history - Chat history
 * @returns {Promise<object>} AI response
 */
export async function processCharacterChat(message, character = 'eliza', history = []) {
  try {
    // Check if Venice client is initialized
    if (!veniceClient) {
      await initializeTerminalAI();
      if (!veniceClient) {
        return {
          success: false,
          response: "Unable to initialize AI system. Please check your API configuration."
        };
      }
    }

    // Custom prompt for character-based interaction
    const customPrompt = `You are roleplaying as ${character}. ${message}`;

    const response = await veniceClient.generateText(customPrompt, {
      model: 'deepseek-r1-671b',
      character: character,
      temperature: 0.8,  // Slightly higher temperature for creative responses
      maxTokens: 1000
    });

    if (response.success) {
      return {
        success: true,
        response: response.text,
        reasoning: response.reasoning || null
      };
    } else {
      return {
        success: false,
        response: `Error: ${response.error || 'Unknown error from AI service'}`
      };
    }
  } catch (error) {
    console.error('Error processing character chat:', error);
    return {
      success: false,
      response: `Error: ${error.message}`
    };
  }
}

/**
 * Get recent research to provide context for the AI
 * @returns {Promise<string>} Research context
 */
export async function getRecentResearchContext() {
  try {
    const researchDir = path.join(process.cwd(), 'research');
    let researchContext = "No recent research available.";

    try {
      // Get list of research files
      const files = await fs.readdir(researchDir);

      // Get the 3 most recent research files
      const mdFiles = files
        .filter(file => file.endsWith('.md'))
        .sort((a, b) => {
          // Extract timestamps from filenames
          const getTimestamp = filename => {
            const match = filename.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}/);
            return match ? match[0] : '';
          };
          const timeA = getTimestamp(a);
          const timeB = getTimestamp(b);
          return timeB.localeCompare(timeA); // Reverse order for newest first
        })
        .slice(0, 3);

      if (mdFiles.length > 0) {
        // Read file contents for context
        const contextPromises = mdFiles.map(async file => {
          const content = await fs.readFile(path.join(researchDir, file), 'utf8');
          const title = content.split('\n')[0].replace('# ', '');
          const summary = content.match(/## Summary\s+([\s\S]*?)(?=##|$)/)?.[1]?.trim() || '';
          return `Research: ${title}\nSummary: ${summary.substring(0, 300)}...\n`;
        });

        const contexts = await Promise.all(contextPromises);
        researchContext = contexts.join('\n');
      }
    } catch (error) {
      console.error('Error reading research directory:', error);
    }

    return researchContext;
  } catch (error) {
    console.error('Error getting research context:', error);
    return 'No recent research available.';
  }
}

export default {
  processTerminalMessage,
  processCharacterChat,
  initializeTerminalAI,
  getRecentResearchContext
};