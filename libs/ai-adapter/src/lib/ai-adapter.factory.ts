import { AiModelAdapter } from './ai-model-adapter.interface';
import { GeminiAdapter } from './adapters/gemini.adapter';
import { ClaudeAdapter } from './adapters/claude.adapter';
import { OpenAiAdapter } from './adapters/openai.adapter';
import { GrokAdapter } from './adapters/grok.adapter';

export interface AiAdapterFactoryOptions {
  provider: string;
  modelName?: string;
  geminiKey?: string;
  anthropicKey?: string;
  openaiKey?: string;
  grokKey?: string;
}

export function createAiAdapter(options: AiAdapterFactoryOptions): AiModelAdapter {
  const provider = (options.provider || 'gemini').toLowerCase();

  switch (provider) {
    case 'gemini': {
      if (!options.geminiKey) throw new Error('Missing GOOGLE_GEN_AI_KEY for Gemini adapter');
      return new GeminiAdapter(options.geminiKey, options.modelName || 'gemini-2.5-flash');
    }
    case 'claude': {
      if (!options.anthropicKey) throw new Error('Missing ANTHROPIC_API_KEY for Claude adapter');
      return new ClaudeAdapter(options.anthropicKey, options.modelName || 'claude-3-5-sonnet-20240620');
    }
    case 'openai': {
      if (!options.openaiKey) throw new Error('Missing OPENAI_API_KEY for OpenAI adapter');
      return new OpenAiAdapter(options.openaiKey, options.modelName || 'gpt-4o');
    }
    case 'grok': {
      if (!options.grokKey) throw new Error('Missing GROK_API_KEY for Grok adapter');
      return new GrokAdapter(options.grokKey, options.modelName || 'grok-2-latest');
    }
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}
