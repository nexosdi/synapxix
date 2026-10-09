import { createAiAdapter } from './ai-adapter.factory';
import { GeminiAdapter } from './adapters/gemini.adapter';
import { ClaudeAdapter } from './adapters/claude.adapter';
import { OpenAiAdapter } from './adapters/openai.adapter';
import { GrokAdapter } from './adapters/grok.adapter';

describe('AiAdapterFactory', () => {
  it('should return GeminiAdapter by default if provider is not specified', () => {
    const adapter = createAiAdapter({ provider: '', geminiKey: 'test-key' });
    expect(adapter).toBeInstanceOf(GeminiAdapter);
  });

  it('should return GeminiAdapter when provider is gemini', () => {
    const adapter = createAiAdapter({ provider: 'gemini', geminiKey: 'test-key' });
    expect(adapter).toBeInstanceOf(GeminiAdapter);
  });

  it('should throw an error if geminiKey is missing for gemini provider', () => {
    expect(() => createAiAdapter({ provider: 'gemini' })).toThrow(/Missing GOOGLE_GEN_AI_KEY/);
  });

  it('should return ClaudeAdapter when provider is claude', () => {
    const adapter = createAiAdapter({ provider: 'claude', anthropicKey: 'test-key' });
    expect(adapter).toBeInstanceOf(ClaudeAdapter);
  });

  it('should throw an error if anthropicKey is missing for claude provider', () => {
    expect(() => createAiAdapter({ provider: 'claude' })).toThrow(/Missing ANTHROPIC_API_KEY/);
  });

  it('should return OpenAiAdapter when provider is openai', () => {
    const adapter = createAiAdapter({ provider: 'openai', openaiKey: 'test-key' });
    expect(adapter).toBeInstanceOf(OpenAiAdapter);
  });

  it('should return GrokAdapter when provider is grok', () => {
    const adapter = createAiAdapter({ provider: 'grok', grokKey: 'test-key' });
    expect(adapter).toBeInstanceOf(GrokAdapter);
  });

  it('should throw an error for unsupported provider', () => {
    expect(() => createAiAdapter({ provider: 'unknown' })).toThrow(/Unsupported AI provider: unknown/);
  });
});
