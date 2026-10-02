import { CampaignPromptInput } from './aiProvider';

export class PromptBuilder {
  static buildCampaignGenerationPrompt(input: CampaignPromptInput): string {
    const platformRules = this.getPlatformRules(input.platform);

    return `
You are an elite, world-class AI Content Strategist and Senior Brand Copywriter.

Your objective is to generate 8 tailored, publish-ready marketing content formats for the following campaign:

=== CAMPAIGN INFORMATION ===
- Brand Name: ${input.brandName}
- Product/Service Name: ${input.productName}
- Industry/Category: ${input.industry || 'General'}
- Target Audience: ${input.audience}
- Primary Campaign Goal: ${input.goal}
- Brand Voice & Tone: ${input.tone}
- Target Platform: ${input.platform}
- Target Keywords: ${input.keywords || 'None specified'}
- Competitors Context: ${input.competitors || 'None specified'}
- Call-To-Action (CTA): ${input.callToAction || 'Default platform CTA'}

=== PLATFORM-SPECIFIC GUIDELINES ===
${platformRules}

=== MANDATORY RULES & GUARDRAILS ===
1. Tone & Audience: Strictly adhere to the "${input.tone}" tone of voice and speak directly to "${input.audience}".
2. Goal Orientation: Ensure all copy aligns with the "${input.goal}" campaign objective.
3. Platform Optimization: Adapt layout, formatting, style, and length specifically for ${input.platform}.
4. Accuracy & Integrity: Do NOT invent fake statistics, unsupported medical/financial claims, or false guarantees.
5. Competitors: Take inspiration from high-performing industry strategies without copying competitor slogans.
6. Format Structure: You MUST return a single JSON object containing ALL 8 required format keys exactly as specified below.

=== OUTPUT JSON SCHEMA REQUIREMENTS ===
Return ONLY a valid JSON object matching this exact schema structure:

{
  "CAPTION": {
    "caption": "Full platform-tailored social media caption text with emojis and formatting",
    "callToAction": "Clear call to action string",
    "characterCount": 250
  },
  "HASHTAGS": {
    "trending": ["#Tag1", "#Tag2", "#Tag3"],
    "niche": ["#NicheTag1", "#NicheTag2"],
    "brand": ["#BrandTag1", "#BrandTag2"],
    "campaign": ["#CampaignTag1", "#CampaignTag2"]
  },
  "AD_COPY": {
    "headline": "High-converting ad headline",
    "primaryText": "Persuasive primary text for social or search ad",
    "callToAction": "Shop Now / Learn More",
    "shortAd": "Short punchy ad variation",
    "longAd": "Detailed storytelling ad variation"
  },
  "BLOG": {
    "title": "Compelling SEO Blog Title",
    "seoOutline": ["H1 / Section 1", "H2 / Section 2", "H3 / Section 3", "Conclusion"],
    "introduction": "Engaging introductory paragraph",
    "sections": [
      { "heading": "Key Section 1 Heading", "body": "Section 1 detailed explanation text..." },
      { "heading": "Key Section 2 Heading", "body": "Section 2 detailed explanation text..." }
    ],
    "conclusion": "Actionable conclusion and CTA"
  },
  "EMAIL": {
    "subjectLine": "High open-rate subject line with emoji",
    "previewText": "Engaging preheader text",
    "body": "Structured email newsletter body with {{First_Name}} placeholder",
    "callToAction": "Email CTA button text"
  },
  "IMAGE_PROMPT": {
    "prompt": "Detailed AI image prompt for DALL-E 3 / Midjourney v6",
    "lighting": "Description of lighting setup",
    "composition": "Framing and camera position",
    "colors": "Color palette specifications",
    "cameraAngle": "Angle (e.g., 35-degree low angle)",
    "style": "Visual style (e.g., Hyper-realistic commercial render)",
    "targetTools": ["Midjourney v6", "DALL-E 3", "Stable Diffusion"]
  },
  "VIDEO_SCRIPT": {
    "title": "Video Script Title",
    "duration": "25-30 Seconds",
    "hook": "High-retention visual & verbal hook (0:00-0:04)",
    "scenes": [
      { "time": "0:00-0:05", "visualHook": "Visual action description", "onScreenText": "TEXT OVERLAY", "voiceOver": "Spoken voiceover text" },
      { "time": "0:05-0:20", "visualHook": "Visual action description", "onScreenText": "TEXT OVERLAY", "voiceOver": "Spoken voiceover text" },
      { "time": "0:20-0:30", "visualHook": "Visual action description", "onScreenText": "CTA TEXT", "voiceOver": "Final CTA voiceover text" }
    ],
    "callToAction": "Video CTA description"
  },
  "VOICE_OVER": {
    "narration": "Conversational audio script with explicit [pause 1s] and [pause 1.5s] markers",
    "pauseMarkers": "Notes on pause placement for pacing",
    "emphasisGuide": "Guide on key words to stress for delivery",
    "estimatedDuration": "20 Seconds"
  }
}

Return raw JSON only. Do not include markdown headers outside the JSON block.
`;
  }

  private static getPlatformRules(platform: string): string {
    switch (platform) {
      case 'Instagram':
        return `- Focus on a strong visual hook in line 1. Use clean spacing, modern emojis, and structured hashtags. Keep the tone engaging and lifestyle-oriented.`;
      case 'LinkedIn':
        return `- Use a professional, thought-leadership style. Focus on business outcomes, industry trends, and value metrics. Avoid excessive fluff or spammy emojis. Use bullet points for readability.`;
      case 'X':
        return `- Concise, punchy, character-conscious copywriting. High impact opening line, strong punchline, and minimal but hyper-relevant hashtags.`;
      case 'Facebook':
        return `- Conversational, community-driven writing. Ask a question to encourage comments and engagement, with a clear direct link CTA.`;
      case 'YouTube':
        return `- Focus on video title optimization, engaging video intro description, key timestamp hooks, and long-form storytelling.`;
      case 'TikTok':
        return `- Fast-paced, trend-conscious short-form script. Include an aggressive 3-second hook, fast visual cuts, high-energy voiceover, and bold on-screen text overlays.`;
      default:
        return `- Adapt copy cleanly to the selected distribution channel with engaging hooks and clear call-to-actions.`;
    }
  }

  static buildRegenerationPrompt(type: string, input: CampaignPromptInput): string {
    return `
You are an expert marketing copywriter.

The user wants a FRESH, DISTINCT variation for the "${type}" format key for campaign "${input.brandName} - ${input.productName}".

Campaign Context:
- Industry: ${input.industry || 'General'}
- Audience: ${input.audience}
- Goal: ${input.goal}
- Tone: ${input.tone}
- Platform: ${input.platform}
- Keywords: ${input.keywords || 'None specified'}
- Competitors context: ${input.competitors || 'None specified'}
- Requested CTA: ${input.callToAction || 'Use an appropriate platform CTA'}

Generate a completely new variation for format key "${type}" returning ONLY the JSON payload for that specific key matching the schema structure.
`;
  }
}
