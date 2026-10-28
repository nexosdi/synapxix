import { GeminiAdapter } from './gemini.adapter';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ContentPart } from '../types';

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue({
            response: { text: () => 'Mocked text response' }
          }),
          generateContentStream: jest.fn().mockResolvedValue({
            stream: (async function* () {
              yield { text: () => 'Mocked text ' };
              yield { text: () => 'stream response' };
            })()
          })
        })
      };
    })
  };
});

describe('GeminiAdapter', () => {
  let adapter: GeminiAdapter;

  beforeEach(() => {
    adapter = new GeminiAdapter('test-api-key');
  });

  it('should instantiate GoogleGenerativeAI with the provided key', () => {
    expect(GoogleGenerativeAI).toHaveBeenCalledWith('test-api-key');
  });

  it('should map a string prompt correctly to generateContent', async () => {
    const result = await adapter.generateContent('Hello world');
    expect(result.text()).toBe('Mocked text response');
  });

  it('should map complex ContentPart[] correctly', async () => {
    const prompt: ContentPart[] = [
      { type: 'text', text: 'Analyze this image:' },
      { type: 'inlineData', mimeType: 'image/jpeg', data: 'base64data' }
    ];

    // Access the private mapPrompt method for testing using any
    const mapped = (adapter as any).mapPrompt(prompt);
    
    expect(mapped).toEqual([
      { text: 'Analyze this image:' },
      { inlineData: { mimeType: 'image/jpeg', data: 'base64data' } }
    ]);
  });
});
