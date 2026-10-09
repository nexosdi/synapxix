import { OpenAiAdapter } from './openai.adapter';

export class GrokAdapter extends OpenAiAdapter {
  constructor(apiKey: string, modelName = 'grok-2-latest') {
    // xAI's Grok API is fully compatible with OpenAI's client library.
    // We just override the baseURL and point it to the xAI endpoint.
    super(apiKey, modelName, 'https://api.x.ai/v1');
  }

  override supportsMultimodal(): boolean {
    // Depending on the exact Grok model version, vision might or might not be supported.
    // Assuming grok-2-vision-latest or grok-2-latest supports it, we return true, 
    // or we could check the modelName.
    return this.modelName.includes('vision') || this.modelName === 'grok-2-latest';
  }
}
