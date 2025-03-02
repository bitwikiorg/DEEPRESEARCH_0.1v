
import { OpenAI } from 'openai';
import type { ModelProviderName, ModelClass } from '../../core/src/types';

/**
 * OpenAI Plugin for COREAI
 * Provides integration with OpenAI's API for text generation and embedding
 */
const openaiPlugin = {
  name: 'openai',
  description: 'Provides access to OpenAI models for text generation and embedding',
  
  initialize: async (config) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI plugin initialization failed: API key not found');
      return { success: false, error: 'OpenAI API key not found' };
    }
    
    try {
      // Create and test OpenAI client
      const openai = new OpenAI({ apiKey });
      
      // Test the connection with a simple completion
      const testResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: 'Test connection' }],
        max_tokens: 5
      });
      
      console.log('OpenAI plugin initialized successfully');
      return { 
        success: true, 
        client: openai,
        provider: 'openai' as ModelProviderName
      };
    } catch (error) {
      console.error('OpenAI plugin initialization failed:', error);
      return { success: false, error: error.message };
    }
  },
  
  generateText: async (client, prompt, modelClass, options = {}) => {
    try {
      // Map model class to actual models
      const modelMap = {
        [ModelClass.SMALL]: 'gpt-4o-mini',
        [ModelClass.MEDIUM]: 'gpt-4o',
        [ModelClass.LARGE]: 'gpt-4o'
      };
      
      const model = modelMap[modelClass] || 'gpt-4o-mini';
      
      const response = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 500,
        ...options
      });
      
      return {
        success: true,
        text: response.choices[0]?.message?.content || '',
        usage: response.usage
      };
    } catch (error) {
      console.error('OpenAI text generation failed:', error);
      return { success: false, error: error.message };
    }
  },
  
  generateEmbedding: async (client, text) => {
    try {
      const response = await client.embeddings.create({
        model: 'text-embedding-3-small',
        input: text
      });
      
      return {
        success: true,
        embedding: response.data[0].embedding,
        usage: response.usage
      };
    } catch (error) {
      console.error('OpenAI embedding generation failed:', error);
      return { success: false, error: error.message };
    }
  }
};

export default openaiPlugin;
