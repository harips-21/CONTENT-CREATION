export interface CampaignPromptInput {
  brandName: string;
  productName: string;
  industry: string;
  audience: string;
  goal: string;
  tone: string;
  platform: string;
  keywords?: string;
  competitors?: string;
  callToAction?: string;
}

export interface GeneratedOutputs {
  CAPTION: any;
  HASHTAGS: any;
  AD_COPY: any;
  BLOG: any;
  EMAIL: any;
  IMAGE_PROMPT: any;
  VIDEO_SCRIPT: any;
  VOICE_OVER: any;
}

export interface IAIProvider {
  name: string;
  generateCampaignContent(input: CampaignPromptInput): Promise<GeneratedOutputs>;
  regenerateSingleFormat(type: string, input: CampaignPromptInput): Promise<any>;
}
