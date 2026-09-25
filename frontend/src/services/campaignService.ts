import { Campaign, CampaignInput, FullCampaignOutput, GeneratedContentItem } from '../types';
import api from './api';

const STORAGE_KEY = 'ai_studio_campaigns';

// Demo initial sample campaign to populate dashboard out of the box
const MOCK_INITIAL_CAMPAIGNS: FullCampaignOutput[] = [
  {
    campaign: {
      id: 'demo-campaign-1',
      userId: 'demo-user-123',
      brandName: 'Aura Luxe',
      productName: 'Aura Smart Watch Series V',
      industry: 'Wearable Technology',
      audience: 'Tech enthusiasts, fitness lovers, and minimalist professionals aged 22-45',
      goal: 'Product Launch',
      tone: 'Luxury',
      platform: 'Instagram',
      keywords: 'SmartWatch, LuxuryTech, FitnessTracker, MinimalistDesign',
      competitors: 'Apple Watch Ultra, Garmin Epix',
      callToAction: 'Order now to receive exclusive launch pricing and complimentary leather strap.',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    contents: {
      CAPTION: {
        id: 'content-1-caption',
        campaignId: 'demo-campaign-1',
        type: 'CAPTION',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: {
          caption: "Elegance meets cutting-edge precision. ✨ Introducing the all-new Aura Smart Watch Series V — crafted from aerospace titanium with 7-day battery life and sapphire crystal glass. Redefine how you conquer your day.",
          callToAction: "Tap the link in bio to claim your early access privilege.",
          characterCount: 236
        }
      },
      HASHTAGS: {
        id: 'content-1-hashtags',
        campaignId: 'demo-campaign-1',
        type: 'HASHTAGS',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: {
          trending: ['#SmartWatch2026', '#LuxuryTech', '#WearableTech'],
          niche: ['#TitaniumWatch', '#MinimalistDesign', '#TechLifestyle'],
          brand: ['#AuraLuxe', '#AuraSeriesV'],
          campaign: ['#RedefineTime', '#ElevateYourWrist']
        }
      },
      AD_COPY: {
        id: 'content-1-adcopy',
        campaignId: 'demo-campaign-1',
        type: 'AD_COPY',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: {
          headline: "The Future of Luxury Wearables Is Here.",
          primaryText: "Engineered from aerospace-grade titanium with an unyielding 7-day battery life and sapphire crystal display. Experience health analytics and seamless connectivity wrapped in timeless elegance.",
          callToAction: "Shop Launch Edition",
          shortAd: "Aerospace titanium. 7-day battery. Unmatched elegance.",
          longAd: "Why settle for disposable plastic smartwatches when you can wear a timepiece engineered from grade-5 aerospace titanium? Meet the Aura Series V. Designed for high performers who demand precision health tracking without sacrificing style."
        }
      },
      BLOG: {
        id: 'content-1-blog',
        campaignId: 'demo-campaign-1',
        type: 'BLOG',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: {
          title: "How Aerospace Titanium Is Disrupting the Luxury Smartwatch Industry",
          seoOutline: ["Introduction to titanium luxury tech", "Battery innovation in 2026", "Health tracking precision", "Conclusion"],
          introduction: "In an era dominated by mass-produced tech gadgets, discerning consumers are seeking wearable devices that combine high-end craftsmanship with intelligent features.",
          sections: [
            {
              heading: "Grade-5 Titanium Meets Precision Engineering",
              body: "The Aura Series V represents a watershed moment in wearable architecture, utilizing materials previously reserved for aerospace and luxury horology."
            },
            {
              heading: "7-Day Battery Life Without Performance Compromise",
              body: "Through proprietary low-power display technology, users enjoy continuous biometric monitoring without nightly charging anxiety."
            }
          ],
          conclusion: "The Aura Smart Watch Series V bridges the gap between traditional watchmaking heritage and modern artificial intelligence."
        }
      },
      EMAIL: {
        id: 'content-1-email',
        campaignId: 'demo-campaign-1',
        type: 'EMAIL',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: {
          subjectLine: "VIP Priority Access: The New Aura Series V Has Arrived ⌚",
          previewText: "Be among the first 500 to reserve aerospace titanium luxury.",
          body: "Hello {{First_Name}},\n\nWe are thrilled to announce the official release of the Aura Smart Watch Series V.\n\nCrafted for those who demand excellence in every detail, Series V delivers 7-day battery autonomy, real-time biometric tracking, and sapphire crystal durability.\n\nAs a valued member of our community, your early access includes a complimentary handcrafted leather wristband with your order.",
          callToAction: "Reserve Your Series V Now"
        }
      },
      IMAGE_PROMPT: {
        id: 'content-1-imageprompt',
        campaignId: 'demo-campaign-1',
        type: 'IMAGE_PROMPT',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: {
          prompt: "Professional studio product advertisement photography of a brushed aerospace titanium luxury smartwatch on a dark obsidian pedestal, subtle cyan rim light, macro lens detail of watch face",
          lighting: "Dramatic dark studio lighting with soft neon blue edge reflections",
          composition: "Rule of thirds centered macro shot, subtle 45-degree angle",
          colors: "Obsidian black, metallic titanium silver, glowing cyan accent",
          cameraAngle: "Slight low-angle hero perspective",
          style: "Hyper-realistic commercial photography, 8k resolution, Hasselblad style",
          targetTools: ['Midjourney v6', 'DALL-E 3', 'Stable Diffusion XL']
        }
      },
      VIDEO_SCRIPT: {
        id: 'content-1-videoscript',
        campaignId: 'demo-campaign-1',
        type: 'VIDEO_SCRIPT',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: {
          title: "Aura Series V Launch Reveal",
          duration: "25 Seconds",
          hook: "Most smartwatches die in 24 hours. This one lasts 7 days in titanium.",
          scenes: [
            {
              time: "0:00 - 0:05",
              visualHook: "Extreme close-up of water droplet falling on sapphire glass screen",
              onScreenText: "7 DAYS. 1 CHARGE.",
              voiceOver: "What if your luxury smartwatch didn't die every night?"
            },
            {
              time: "0:05 - 0:15",
              visualHook: "Fast macro cuts of titanium casing, heart rate monitor glowing green",
              onScreenText: "AEROSPACE TITANIUM GRADE 5",
              voiceOver: "Meet the Aura Series V. Aerospace titanium, military durability, continuous biometric intelligence."
            },
            {
              time: "0:15 - 0:25",
              visualHook: "Model adjusting watch strap on wrist walking into modern skyscraper",
              onScreenText: "TAP TO RESERVE LAUNCH EDITION",
              voiceOver: "Elegance redefined. Claim your VIP launch edition today."
            }
          ],
          callToAction: "Tap Shop Now for Launch Pricing"
        }
      },
      VOICE_OVER: {
        id: 'content-1-voiceover',
        campaignId: 'demo-campaign-1',
        type: 'VOICE_OVER',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: {
          narration: "What if your timepiece did more than just tell time? [pause 1s] What if it empowered your day, monitored your health, and looked effortless in any boardroom? [pause 1.5s] Introducing the Aura Smart Watch Series V.",
          pauseMarkers: "Includes 1s and 1.5s rhetorical pauses between value propositions.",
          emphasisGuide: "Emphasize 'did more', 'empowered', and 'Aura Series V'. Use a sleek, confident tone.",
          estimatedDuration: "20 Seconds"
        }
      }
    }
  }
];

export class CampaignService {
  static getCampaigns(): FullCampaignOutput[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INITIAL_CAMPAIGNS));
      return MOCK_INITIAL_CAMPAIGNS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return MOCK_INITIAL_CAMPAIGNS;
    }
  }

  static async fetchAllCampaigns(): Promise<FullCampaignOutput[]> {
    try {
      const res = await api.get('/campaigns');
      if (res.data && Array.isArray(res.data.campaigns)) {
        return res.data.campaigns;
      }
    } catch (err) {
      console.warn("Backend API not available, using local campaign store.");
    }
    return this.getCampaigns();
  }

  static async getCampaignById(id: string): Promise<FullCampaignOutput | null> {
    try {
      const res = await api.get(`/campaigns/${id}`);
      if (res.data && res.data.campaign) {
        return res.data;
      }
    } catch (err) {
      console.warn("Backend API call failed, searching local campaign store.");
    }
    const all = this.getCampaigns();
    return all.find(item => item.campaign.id === id) || null;
  }

  static saveCampaign(campaignOutput: FullCampaignOutput): void {
    const campaigns = this.getCampaigns();
    const index = campaigns.findIndex(c => c.campaign.id === campaignOutput.campaign.id);
    if (index >= 0) {
      campaigns[index] = campaignOutput;
    } else {
      campaigns.unshift(campaignOutput);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  }

  static deleteCampaign(id: string): void {
    const campaigns = this.getCampaigns().filter(c => c.campaign.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  }

  static duplicateCampaign(id: string): FullCampaignOutput | null {
    const existing = this.getCampaigns().find(c => c.campaign.id === id);
    if (!existing) return null;

    const newId = `campaign-${Date.now()}`;
    const duplicated: FullCampaignOutput = JSON.parse(JSON.stringify(existing));
    duplicated.campaign.id = newId;
    duplicated.campaign.brandName = `${existing.campaign.brandName} (Copy)`;
    duplicated.campaign.createdAt = new Date().toISOString();
    duplicated.campaign.updatedAt = new Date().toISOString();

    // Update campaignId on contents
    Object.keys(duplicated.contents).forEach(key => {
      const item = duplicated.contents[key as keyof typeof duplicated.contents];
      if (item) {
        item.id = `content-${Date.now()}-${key}`;
        item.campaignId = newId;
      }
    });

    this.saveCampaign(duplicated);
    return duplicated;
  }
}
