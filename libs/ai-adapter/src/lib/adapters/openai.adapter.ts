import OpenAI from 'openai';
import { AiModelAdapter } from '../ai-model-adapter.interface';
import { AiGenerateOptions, AiResponse, ContentPart } from '../types';

export class OpenAiAdapter implements AiModelAdapter {
  protected openai: OpenAI;
  protected modelName: string;

  constructor(apiKey: string, modelName = 'gpt-4o', baseURL?: string) {
    this.openai = new OpenAI({ apiKey, baseURL });
    this.modelName = modelName;
  }

  protected mapPrompt(prompt: string | ContentPart[]): OpenAI.Chat.ChatCompletionMessageParam[] {
    if (typeof prompt === 'string') {
      return [{ role: 'user', content: prompt }];
    }
    
    const content = prompt.map((p): OpenAI.Chat.ChatCompletionContentPart => {
      if (p.type === 'text') {
        return { type: 'text', text: p.text };
      } else {
        return {
          type: 'image_url',
          image_url: {
            url: `data:${p.mimeType};base64,${p.data}`,
          },
        };
      }
    });

    return [{ role: 'user', content }];
  }

  async generateContent(prompt: string | ContentPart[], options?: AiGenerateOptions): Promise<AiResponse> {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    if (options?.systemInstruction) {
      messages.push({ role: 'system', content: options.systemInstruction });
    }
    messages.push(...this.mapPrompt(prompt));

    const response = await this.openai.chat.completions.create({
      model: this.modelName,
      messages,
      temperature: options?.temperature,
      max_tokens: options?.maxTokens,
      top_p: options?.topP,
      response_format: options?.responseMimeType === 'application/json' ? { type: 'json_object' } : undefined,
    });

    return {
      text: () => response.choices[0]?.message?.content || '',
    };
  }

  async *generateContentStream(
    prompt: string | ContentPart[],
    options?: AiGenerateOptions,
    signal?: AbortSignal
  ): AsyncGenerator<string> {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    if (options?.systemInstruction) {
      messages.push({ role: 'system', content: options.systemInstruction });
    }
    messages.push(...this.mapPrompt(prompt));

    const stream = await this.openai.chat.completions.create({
      model: this.modelName,
      messages,
      temperature: options?.temperature,
      max_tokens: options?.maxTokens,
      top_p: options?.topP,
      response_format: options?.responseMimeType === 'application/json' ? { type: 'json_object' } : undefined,
      stream: true,
    }, { signal });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      if (text) {
        yield text;
      }
    }
  }

  supportsMultimodal(): boolean {
    return true;
  }
}
