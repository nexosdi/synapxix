import Anthropic from '@anthropic-ai/sdk';
import { AiModelAdapter } from '../ai-model-adapter.interface';
import { AiGenerateOptions, AiResponse, ContentPart } from '../types';

export class ClaudeAdapter implements AiModelAdapter {
  private anthropic: Anthropic;
  private modelName: string;

  constructor(apiKey: string, modelName = 'claude-3-5-sonnet-20240620') {
    this.anthropic = new Anthropic({ apiKey });
    this.modelName = modelName;
  }

  private mapPrompt(prompt: string | ContentPart[]): Anthropic.MessageParam[] {
    if (typeof prompt === 'string') {
      return [{ role: 'user', content: prompt }];
    }
    
    const content = prompt.map((p): Anthropic.ContentBlockParam => {
      if (p.type === 'text') {
        return { type: 'text', text: p.text };
      } else {
        return {
          type: 'image',
          source: {
            type: 'base64',
            media_type: p.mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
            data: p.data,
          },
        };
      }
    });

    return [{ role: 'user', content }];
  }

  async generateContent(prompt: string | ContentPart[], options?: AiGenerateOptions): Promise<AiResponse> {
    const messages = this.mapPrompt(prompt);
    
    const response = await this.anthropic.messages.create({
      model: this.modelName,
      max_tokens: options?.maxTokens || 4096,
      temperature: options?.temperature,
      top_p: options?.topP,
      system: options?.systemInstruction,
      messages,
    });

    return {
      text: () => {
        const block = response.content.find(c => c.type === 'text');
        return block?.type === 'text' ? block.text : '';
      }
    };
  }

  async *generateContentStream(
    prompt: string | ContentPart[],
    options?: AiGenerateOptions,
    signal?: AbortSignal
  ): AsyncGenerator<string> {
    const messages = this.mapPrompt(prompt);
    
    const stream = await this.anthropic.messages.create({
      model: this.modelName,
      max_tokens: options?.maxTokens || 4096,
      temperature: options?.temperature,
      top_p: options?.topP,
      system: options?.systemInstruction,
      messages,
      stream: true,
    }, { signal });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        yield chunk.delta.text;
      }
    }
  }

  supportsMultimodal(): boolean {
    return true;
  }
}
