import { AiResponse, ContentPart, AiGenerateOptions } from './types';

export interface AiModelAdapter {
  /**
   * Generates a single response from the AI model.
   * @param prompt String or array of parts (text/images)
   * @param options Generation configuration
   */
  generateContent(prompt: string | ContentPart[], options?: AiGenerateOptions): Promise<AiResponse>;

  /**
   * Generates a streaming response from the AI model.
   * @param prompt String or array of parts (text/images)
   * @param options Generation configuration
   * @param signal Abort signal to cancel the stream
   */
  generateContentStream(
    prompt: string | ContentPart[],
    options?: AiGenerateOptions,
    signal?: AbortSignal
  ): AsyncGenerator<string>;

  /**
   * Indicates if the provider supports multimodal inputs (images, audio, etc)
   */
  supportsMultimodal(): boolean;
}
