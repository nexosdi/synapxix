import { GoogleGenerativeAI, Part, GenerationConfig } from '@google/generative-ai';
import { AiModelAdapter } from '../ai-model-adapter.interface';
import { AiGenerateOptions, AiResponse, ContentPart } from '../types';

export class GeminiAdapter implements AiModelAdapter {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor(apiKey: string, modelName = 'gemini-2.5-flash') {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
  }

  private mapOptions(options?: AiGenerateOptions): GenerationConfig {
    if (!options) return {};
    return {
      temperature: options.temperature,
      maxOutputTokens: options.maxTokens,
      topP: options.topP,
      topK: options.topK,
      responseMimeType: options.responseMimeType,
    };
  }

  private mapPrompt(prompt: string | ContentPart[]): string | Part[] {
    if (typeof prompt === 'string') {
      return prompt;
    }
    return prompt.map((p): Part => {
      if (p.type === 'text') {
        return { text: p.text };
      } else {
        return {
          inlineData: {
            data: p.data,
            mimeType: p.mimeType,
          },
        };
      }
    });
  }

  async generateContent(prompt: string | ContentPart[], options?: AiGenerateOptions): Promise<AiResponse> {
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: options?.systemInstruction,
    });

    const mappedPrompt = this.mapPrompt(prompt);
    
    // GoogleGenerativeAI expects an array of parts or a string
    const request = Array.isArray(mappedPrompt) ? mappedPrompt : [mappedPrompt];
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: request as Part[] }],
      generationConfig: this.mapOptions(options),
    });

    return {
      text: () => result.response.text(),
    };
  }

  async *generateContentStream(
    prompt: string | ContentPart[],
    options?: AiGenerateOptions,
    signal?: AbortSignal
  ): AsyncGenerator<string> {
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: options?.systemInstruction,
    });

    const mappedPrompt = this.mapPrompt(prompt);
    const request = Array.isArray(mappedPrompt) ? mappedPrompt : [mappedPrompt];
    
    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: request as Part[] }],
      generationConfig: this.mapOptions(options),
    }, { signal });

    for await (const chunk of result.stream) {
      yield chunk.text();
    }
  }

  supportsMultimodal(): boolean {
    return true;
  }
}
