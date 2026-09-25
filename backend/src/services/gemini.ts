import { IAIProvider, CampaignPromptInput, GeneratedOutputs } from './aiProvider';
import { MockAIProvider } from './mockProvider';
import { OpenAIProvider } from './openai';

export class GeminiProvider implements IAIProvider {
  name = 'GeminiProvider';
  private fallback = new MockAIProvider();

  async generateCampaignContent(input: CampaignPromptInput): Promise<GeneratedOutputs> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log('Gemini API key missing. Using Mock Provider fallback.');
      return this.fallback.generateCampaignContent(input);
    }
    return this.fallback.generateCampaignContent(input);
  }

  async regenerateSingleFormat(type: string, input: CampaignPromptInput): Promise<any> {
    return this.fallback.regenerateSingleFormat(type, input);
  }
}

export function getAIProvider(): IAIProvider {
  const providerType = process.env.AI_PROVIDER || 'mock';
  if (providerType === 'openai') {
    return new OpenAIProvider();
  } else if (providerType === 'gemini') {
    return new GeminiProvider();
  }
  return new MockAIProvider();
}
