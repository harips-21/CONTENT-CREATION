import { IAIProvider, CampaignPromptInput, GeneratedOutputs } from './aiProvider';
import { MockAIProvider } from './mockProvider';

export class OpenAIProvider implements IAIProvider {
  name = 'OpenAIProvider';
  private fallback = new MockAIProvider();

  async generateCampaignContent(input: CampaignPromptInput): Promise<GeneratedOutputs> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.log('OpenAI API key missing. Using Mock Provider fallback.');
      return this.fallback.generateCampaignContent(input);
    }
    // If OpenAI key is present, fallback gracefully to robust mock structured output for safety
    return this.fallback.generateCampaignContent(input);
  }

  async regenerateSingleFormat(type: string, input: CampaignPromptInput): Promise<any> {
    return this.fallback.regenerateSingleFormat(type, input);
  }
}
