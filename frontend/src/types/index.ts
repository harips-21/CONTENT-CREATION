export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type PlatformType = 'Instagram' | 'LinkedIn' | 'X' | 'Facebook' | 'YouTube' | 'TikTok';
export type CampaignGoal = 'Product Launch' | 'Brand Awareness' | 'Sales' | 'Engagement' | 'Event Promotion';
export type ToneType = 'Professional' | 'Friendly' | 'Luxury' | 'Funny' | 'Bold' | 'Minimal' | 'Emotional';

export interface CampaignInput {
  brandName: string;
  productName: string;
  industry: string;
  audience: string;
  goal: CampaignGoal;
  tone: ToneType;
  platform: PlatformType;
  keywords?: string;
  competitors?: string;
  callToAction?: string;
}

export interface Campaign extends CampaignInput {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  contents?: GeneratedContentItem[];
}

export type ContentType = 
  | 'CAPTION'
  | 'HASHTAGS'
  | 'AD_COPY'
  | 'BLOG'
  | 'EMAIL'
  | 'IMAGE_PROMPT'
  | 'VIDEO_SCRIPT'
  | 'VOICE_OVER';

export interface CaptionContent {
  caption: string;
  callToAction: string;
  characterCount: number;
}

export interface HashtagContent {
  trending: string[];
  niche: string[];
  brand: string[];
  campaign: string[];
}

export interface AdCopyContent {
  headline: string;
  primaryText: string;
  callToAction: string;
  shortAd: string;
  longAd: string;
}

export interface BlogContent {
  title: string;
  seoOutline: string[];
  introduction: string;
  sections: { heading: string; body: string }[];
  conclusion: string;
}

export interface EmailContent {
  subjectLine: string;
  previewText: string;
  body: string;
  callToAction: string;
}

export interface ImagePromptContent {
  prompt: string;
  lighting: string;
  composition: string;
  colors: string;
  cameraAngle: string;
  style: string;
  targetTools: string[];
}

export interface VideoScriptScene {
  time: string;
  visualHook: string;
  onScreenText: string;
  voiceOver: string;
}

export interface VideoScriptContent {
  title: string;
  duration: string;
  hook: string;
  scenes: VideoScriptScene[];
  callToAction: string;
}

export interface VoiceOverContent {
  narration: string;
  pauseMarkers: string;
  emphasisGuide: string;
  estimatedDuration: string;
}

export type AnyContentData = 
  | CaptionContent 
  | HashtagContent 
  | AdCopyContent 
  | BlogContent 
  | EmailContent 
  | ImagePromptContent 
  | VideoScriptContent 
  | VoiceOverContent;

export interface GeneratedContentItem {
  id: string;
  campaignId: string;
  type: ContentType;
  content: AnyContentData;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface FullCampaignOutput {
  campaign: Campaign;
  contents: Record<ContentType, GeneratedContentItem>;
}
