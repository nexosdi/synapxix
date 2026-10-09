import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createAiAdapter, AiAdapterFactoryOptions } from '@nexosdi.synapxix/ai-adapter';

export const AI_ADAPTER_TOKEN = 'AI_ADAPTER_TOKEN';

export const AiAdapterProvider: Provider = {
  provide: AI_ADAPTER_TOKEN,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const options: AiAdapterFactoryOptions = {
      provider: configService.get<string>('AI_PROVIDER', 'gemini'),
      modelName: configService.get<string>('AI_MODEL_NAME'),
      geminiKey: configService.get<string>('GOOGLE_GEN_AI_KEY'),
      anthropicKey: configService.get<string>('ANTHROPIC_API_KEY'),
      openaiKey: configService.get<string>('OPENAI_API_KEY'),
      grokKey: configService.get<string>('GROK_API_KEY'),
    };
    return createAiAdapter(options);
  },
};
