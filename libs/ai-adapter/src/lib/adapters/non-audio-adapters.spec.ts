import { ClaudeAdapter } from './claude.adapter';
import { OpenAiAdapter } from './openai.adapter';

describe('adapters without audio input support', () => {
  it.each([
    ['OpenAI', new OpenAiAdapter('test-key'), 'openai'],
    ['Claude', new ClaudeAdapter('test-key'), 'claude'],
  ])('%s rejects audio data instead of treating it as an image', (_name, adapter: any, _provider: string) => {
    expect(() => adapter.mapPrompt([
      { type: 'text', text: 'Evaluate this recording' },
      { type: 'inlineData', mimeType: 'audio/webm', data: 'base64-audio' },
    ])).toThrow(/does not support audio\/webm input/);
  });
});
