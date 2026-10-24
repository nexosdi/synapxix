export interface TextPart {
  type: 'text';
  text: string;
}

export interface InlineDataPart {
  type: 'inlineData';
  mimeType: string;
  data: string; // base64
}

export type ContentPart = TextPart | InlineDataPart;

export interface AiResponse {
  text(): string;
}

export interface AiGenerateOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  systemInstruction?: string;
  responseMimeType?: string;
}
