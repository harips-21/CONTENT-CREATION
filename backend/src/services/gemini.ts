import { IAIProvider, CampaignPromptInput, GeneratedOutputs, AIProviderError } from './aiProvider';
import { MockAIProvider } from './mockProvider';
import { OpenAIProvider } from './openai';
import { PromptBuilder } from './promptBuilder';

const isGeminiConfigured = (): boolean => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  return !!apiKey && apiKey !== 'your_key_here';
};

const parseJsonResponse = (rawText: string): Record<string, any> | null => {
  const cleanedText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
  try {
    const parsed = JSON.parse(cleanedText);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, any>;
    }
  } catch (err) {
    console.warn('[AI] Error parsing JSON from Gemini response:', err);
  }
  return null;
};

const isValidFormatOutput = (type: keyof GeneratedOutputs, value: any): boolean => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  switch (type) {
    case 'CAPTION':
      return typeof value.caption === 'string';
    case 'HASHTAGS':
      return ['trending', 'niche', 'brand', 'campaign'].every((key) => Array.isArray(value[key]));
    case 'AD_COPY':
      return typeof value.headline === 'string' && typeof value.primaryText === 'string';
    case 'BLOG':
      return typeof value.title === 'string' && Array.isArray(value.seoOutline) && typeof value.introduction === 'string';
    case 'EMAIL':
      return typeof value.subjectLine === 'string' && typeof value.body === 'string';
    case 'IMAGE_PROMPT':
      return typeof value.prompt === 'string';
    case 'VIDEO_SCRIPT':
      return typeof value.hook === 'string' && Array.isArray(value.scenes);
    case 'VOICE_OVER':
      return typeof value.narration === 'string';
  }
};

export class GeminiProvider implements IAIProvider {
  get name(): string {
    return isGeminiConfigured() ? 'GeminiProvider' : 'MockAIProvider';
  }

  private fallback = new MockAIProvider();

  async generateCampaignContent(input: CampaignPromptInput): Promise<GeneratedOutputs> {
    const apiKey = process.env.GEMINI_API_KEY?.trim() || '';
    let model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

    // Auto-correct unreleased model names
    if (model === 'gemini-2.5-flash') {
      model = 'gemini-1.5-flash';
    }

    if (!isGeminiConfigured()) {
      console.log('[AI] Provider: MockAIProvider (Demo Mode)');
      return this.fallback.generateCampaignContent(input);
    }

    console.log(`[AI] Provider: Gemini API (Model: ${model})`);
    const prompt = PromptBuilder.buildCampaignGenerationPrompt(input);
    
    // Try primary model, fallback to gemini-1.5-flash if needed
    const modelsToTry = [model, 'gemini-1.5-flash', 'gemini-2.0-flash'];

    for (const currentModel of Array.from(new Set(modelsToTry))) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(currentModel)}:generateContent`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.7,
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`[AI] Gemini API (${currentModel}) returned HTTP ${response.status}: ${errorText}`);
          if (response.status === 404 || response.status === 400) {
            // Model not found or bad request format, try next candidate model
            continue;
          }
          // For auth errors or rate limits, log warning and use fallback provider
          console.log('[AI] Gemini API error encountered. Falling back smoothly to MockAIProvider.');
          return this.fallback.generateCampaignContent(input);
        }

        const responseData: any = await response.json();
        const rawText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (typeof rawText === 'string' && rawText.trim() !== '') {
          const parsed = parseJsonResponse(rawText);
          if (parsed) {
            const mockDefault = await this.fallback.generateCampaignContent(input);
            const requiredFormats: (keyof GeneratedOutputs)[] = [
              'CAPTION', 'HASHTAGS', 'AD_COPY', 'BLOG', 'EMAIL', 'IMAGE_PROMPT', 'VIDEO_SCRIPT', 'VOICE_OVER',
            ];

            // Fill any missing or invalid keys with mock defaults
            const validatedOutput: GeneratedOutputs = {
              CAPTION: isValidFormatOutput('CAPTION', parsed.CAPTION) ? parsed.CAPTION : mockDefault.CAPTION,
              HASHTAGS: isValidFormatOutput('HASHTAGS', parsed.HASHTAGS) ? parsed.HASHTAGS : mockDefault.HASHTAGS,
              AD_COPY: isValidFormatOutput('AD_COPY', parsed.AD_COPY) ? parsed.AD_COPY : mockDefault.AD_COPY,
              BLOG: isValidFormatOutput('BLOG', parsed.BLOG) ? parsed.BLOG : mockDefault.BLOG,
              EMAIL: isValidFormatOutput('EMAIL', parsed.EMAIL) ? parsed.EMAIL : mockDefault.EMAIL,
              IMAGE_PROMPT: isValidFormatOutput('IMAGE_PROMPT', parsed.IMAGE_PROMPT) ? parsed.IMAGE_PROMPT : mockDefault.IMAGE_PROMPT,
              VIDEO_SCRIPT: isValidFormatOutput('VIDEO_SCRIPT', parsed.VIDEO_SCRIPT) ? parsed.VIDEO_SCRIPT : mockDefault.VIDEO_SCRIPT,
              VOICE_OVER: isValidFormatOutput('VOICE_OVER', parsed.VOICE_OVER) ? parsed.VOICE_OVER : mockDefault.VOICE_OVER,
            };

            console.log('✅ [AI] Real Gemini content successfully generated!');
            return validatedOutput;
          }
        }
      } catch (err: any) {
        console.warn(`[AI] Exception during Gemini API call (${currentModel}):`, err.message || err);
      }
    }

    console.log('[AI] Could not complete Gemini API call. Using MockAIProvider fallback.');
    return this.fallback.generateCampaignContent(input);
  }

  async regenerateSingleFormat(type: string, input: CampaignPromptInput): Promise<any> {
    const apiKey = process.env.GEMINI_API_KEY?.trim() || '';
    let model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    if (model === 'gemini-2.5-flash') model = 'gemini-1.5-flash';

    if (!isGeminiConfigured()) {
      return this.fallback.regenerateSingleFormat(type, input);
    }

    try {
      const prompt = PromptBuilder.buildRegenerationPrompt(type, input);
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.8 },
        }),
      });

      if (response.ok) {
        const data: any = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = parseJsonResponse(rawText);
          if (parsed) {
            const output = parsed[type as keyof GeneratedOutputs] || parsed;
            if (isValidFormatOutput(type as keyof GeneratedOutputs, output)) {
              console.log(`✅ [AI] Single format (${type}) regenerated via Gemini!`);
              return output;
            }
          }
        }
      }
    } catch (err) {
      console.warn(`[AI] Gemini regeneration failed for ${type}. Using fallback.`);
    }

    return this.fallback.regenerateSingleFormat(type, input);
  }
}

export function getAIProvider(): IAIProvider {
  const providerType = process.env.AI_PROVIDER || 'gemini';
  if (isGeminiConfigured()) {
    return new GeminiProvider();
  }
  if (providerType === 'openai') {
    return new OpenAIProvider();
  } else if (providerType === 'gemini') {
    return new GeminiProvider();
  }
  return new MockAIProvider();
}

export function getAIStatusInfo() {
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const isConnected = isGeminiConfigured();

  return {
    provider: isConnected ? 'gemini' : 'mock',
    status: isConnected ? 'Gemini Connected' : 'Demo Mode',
    model: isConnected ? model : 'N/A',
  };
}
