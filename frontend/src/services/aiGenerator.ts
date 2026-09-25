import { CampaignInput, FullCampaignOutput, ContentType, GeneratedContentItem } from '../types';

export class AIGeneratorEngine {
  static generateFullCampaign(input: CampaignInput, userId: string = 'user-1'): FullCampaignOutput {
    const campaignId = `campaign-${Date.now()}`;
    const now = new Date().toISOString();

    const campaign = {
      id: campaignId,
      userId,
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    const caption = this.generateCaption(input);
    const hashtags = this.generateHashtags(input);
    const adCopy = this.generateAdCopy(input);
    const blog = this.generateBlog(input);
    const email = this.generateEmail(input);
    const imagePrompt = this.generateImagePrompt(input);
    const videoScript = this.generateVideoScript(input);
    const voiceOver = this.generateVoiceOver(input);

    const contents: Record<ContentType, GeneratedContentItem> = {
      CAPTION: {
        id: `content-${Date.now()}-caption`,
        campaignId,
        type: 'CAPTION',
        content: caption,
        version: 1,
        createdAt: now,
        updatedAt: now,
      },
      HASHTAGS: {
        id: `content-${Date.now()}-hashtags`,
        campaignId,
        type: 'HASHTAGS',
        content: hashtags,
        version: 1,
        createdAt: now,
        updatedAt: now,
      },
      AD_COPY: {
        id: `content-${Date.now()}-adcopy`,
        campaignId,
        type: 'AD_COPY',
        content: adCopy,
        version: 1,
        createdAt: now,
        updatedAt: now,
      },
      BLOG: {
        id: `content-${Date.now()}-blog`,
        campaignId,
        type: 'BLOG',
        content: blog,
        version: 1,
        createdAt: now,
        updatedAt: now,
      },
      EMAIL: {
        id: `content-${Date.now()}-email`,
        campaignId,
        type: 'EMAIL',
        content: email,
        version: 1,
        createdAt: now,
        updatedAt: now,
      },
      IMAGE_PROMPT: {
        id: `content-${Date.now()}-imageprompt`,
        campaignId,
        type: 'IMAGE_PROMPT',
        content: imagePrompt,
        version: 1,
        createdAt: now,
        updatedAt: now,
      },
      VIDEO_SCRIPT: {
        id: `content-${Date.now()}-videoscript`,
        campaignId,
        type: 'VIDEO_SCRIPT',
        content: videoScript,
        version: 1,
        createdAt: now,
        updatedAt: now,
      },
      VOICE_OVER: {
        id: `content-${Date.now()}-voiceover`,
        campaignId,
        type: 'VOICE_OVER',
        content: voiceOver,
        version: 1,
        createdAt: now,
        updatedAt: now,
      },
    };

    return { campaign, contents };
  }

  // 1. Social Media Caption
  private static generateCaption(input: CampaignInput) {
    const cta = input.callToAction || `Discover ${input.productName} today. Link in bio!`;
    let captionText = '';

    if (input.platform === 'Instagram') {
      captionText = `✨ Elevate your daily routine with ${input.productName} by ${input.brandName}.\n\nEngineered specifically for ${input.audience}, this game-changer combines ${input.tone.toLowerCase()} design with uncompromised performance.\n\nReady to experience the difference?\n\n👉 ${cta}`;
    } else if (input.platform === 'LinkedIn') {
      captionText = `In today's fast-moving ${input.industry} landscape, efficiency and precision are non-negotiable.\n\nAt ${input.brandName}, we're excited to announce ${input.productName} — built from the ground up for ${input.audience}.\n\nKey Highlights:\n• Tailored for modern ${input.industry} workflows\n• Designed to drive real ${input.goal.toLowerCase()} outcomes\n• Crafted with a ${input.tone.toLowerCase()} touch\n\nHow is your organization approaching ${input.industry} innovation this quarter?\n\n${cta}`;
    } else if (input.platform === 'X') {
      captionText = `Big news from @${input.brandName.replace(/\s+/g, '')}! 🚀\n\nIntroducing ${input.productName} — engineered for ${input.audience}.\n\nAchieve your ${input.goal.toLowerCase()} goals effortlessly.\n\n${cta}`;
    } else {
      captionText = `Meet ${input.productName} by ${input.brandName}! 🔥\n\nBuilt for ${input.audience} looking for top-tier ${input.industry} solutions with a ${input.tone.toLowerCase()} experience.\n\n${cta}`;
    }

    return {
      caption: captionText,
      callToAction: cta,
      characterCount: captionText.length,
    };
  }

  // 2. Hashtags
  private static generateHashtags(input: CampaignInput) {
    const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '');
    const brandTag = `#${sanitize(input.brandName)}`;
    const productTag = `#${sanitize(input.productName)}`;
    const industryTag = `#${sanitize(input.industry)}`;

    return {
      trending: [`#${sanitize(input.industry)}2026`, '#InnovationInMotion', '#FutureOfTech', '#TrendingNow'],
      niche: [`#${sanitize(input.audience.split(' ')[0] || 'Creators')}`, industryTag, '#SmartChoice', '#QualityFirst'],
      brand: [brandTag, productTag],
      campaign: [`#${sanitize(input.brandName)}${sanitize(input.goal)}`, '#LaunchDay', '#NextLevel'],
    };
  }

  // 3. Ad Copy
  private static generateAdCopy(input: CampaignInput) {
    const defaultCTA = input.callToAction || 'Shop Now';
    return {
      headline: `Experience ${input.productName} by ${input.brandName}`,
      primaryText: `Built for ${input.audience} who refuse to compromise. ${input.productName} delivers exceptional results aligned with your ${input.goal.toLowerCase()} goals.`,
      callToAction: defaultCTA,
      shortAd: `Transform your ${input.industry} experience with ${input.productName}. ${defaultCTA}!`,
      longAd: `Struggling with outdated ${input.industry} solutions? ${input.brandName} introduces ${input.productName}. Crafted with a ${input.tone.toLowerCase()} philosophy to help ${input.audience} achieve maximum impact. Try it today with zero risk.`,
    };
  }

  // 4. Blog Content
  private static generateBlog(input: CampaignInput) {
    return {
      title: `The Ultimate Guide to ${input.productName}: Transforming ${input.industry} in 2026`,
      seoOutline: [
        `1. The Evolution of ${input.industry}`,
        `2. Introducing ${input.productName}`,
        `3. Why ${input.audience} Need This Solution`,
        `4. Key Features & ${input.tone} Design`,
        `5. Conclusion & Actionable Steps`,
      ],
      introduction: `As the ${input.industry} market continues to evolve, professionals and consumers alike are seeking tools that streamline their workflows and deliver remarkable results. ${input.brandName} answers this call with ${input.productName}.`,
      sections: [
        {
          heading: `Why ${input.productName} Stands Out`,
          body: `Engineered specifically for ${input.audience}, ${input.productName} bridges the gap between sophisticated engineering and intuitive usability. Whether your primary focus is ${input.goal.toLowerCase()} or long-term growth, this solution delivers.`,
        },
        {
          heading: `The Power of ${input.tone} Innovation`,
          body: `By combining a ${input.tone.toLowerCase()} aesthetic with robust performance, ${input.brandName} has set a new benchmark in ${input.industry}.`,
        },
      ],
      conclusion: `In conclusion, ${input.productName} isn't just another product—it's a paradigm shift for ${input.audience}. ${input.callToAction || 'Get started today to experience the future.'}`,
    };
  }

  // 5. Email Marketing
  private static generateEmail(input: CampaignInput) {
    const cta = input.callToAction || `Discover ${input.productName}`;
    return {
      subjectLine: `Introducing ${input.productName}: Built for Your ${input.goal} Goals 🚀`,
      previewText: `Be the first to experience ${input.brandName}'s newest ${input.industry} breakthrough.`,
      body: `Hi {{First_Name}},\n\nWe know how important it is to find ${input.industry} solutions that truly deliver.\n\nThat's why we built ${input.productName} — designed from the ground up for ${input.audience}.\n\nWhether you're looking for superior quality, effortless usability, or a ${input.tone.toLowerCase()} touch, ${input.productName} delivers on every front.\n\nClick below to learn more and claim your exclusive introductory offer:`,
      callToAction: cta,
    };
  }

  // 6. AI Image Prompt
  private static generateImagePrompt(input: CampaignInput) {
    return {
      prompt: `Commercial hero product photograph of ${input.productName} by ${input.brandName}, presented on a sleek minimalist pedestal, vibrant lighting accents, ultra-high resolution 8k, cinematic depth of field`,
      lighting: `Soft gradient studio key light with vibrant blue-purple rim illumination`,
      composition: `Symmetrical rule-of-thirds hero positioning, shallow depth of field`,
      colors: `Modern palette featuring royal blue, neon violet, crisp white, and metallic accents`,
      cameraAngle: `35-degree elevated perspective, macro lens detail`,
      style: `Commercial 3D product render, Octane Render style, hyper-detailed, clean SaaS aesthetic`,
      targetTools: ['Midjourney v6', 'DALL-E 3', 'Stable Diffusion XL'],
    };
  }

  // 7. Short Video Script
  private static generateVideoScript(input: CampaignInput) {
    return {
      title: `${input.brandName} - ${input.productName} 30s Viral Script`,
      duration: '25 Seconds',
      hook: `Stop scrolling if you care about your ${input.industry} results!`,
      scenes: [
        {
          time: '0:00 - 0:04',
          visualHook: `Fast zooms of common frustration in ${input.industry} with bold red text overlay.`,
          onScreenText: 'TIRED OF OLD SOLUTIONS?',
          voiceOver: `Are you still using outdated tools for your ${input.industry} goals?`,
        },
        {
          time: '0:04 - 0:14',
          visualHook: `Sleek transition revealing ${input.productName} in action with bright glowing lighting.`,
          onScreenText: `MEET ${input.productName.toUpperCase()}`,
          voiceOver: `Meet ${input.productName} by ${input.brandName}. Designed specifically for ${input.audience}.`,
        },
        {
          time: '0:14 - 0:25',
          visualHook: `Happy creator holding smartphone showing quick results, smiling at camera.`,
          onScreenText: `TAP LINK TO GET STARTED`,
          voiceOver: `${input.callToAction || 'Tap the link below to get instant access today!'}`,
        },
      ],
      callToAction: input.callToAction || 'Tap the link in bio to learn more!',
    };
  }

  // 8. Voice-over Script
  private static generateVoiceOver(input: CampaignInput) {
    return {
      narration: `What if you could transform your ${input.industry} journey overnight? [pause 1s] Meet ${input.productName} by ${input.brandName}. [pause 0.5s] Crafted with a ${input.tone.toLowerCase()} philosophy for ${input.audience}. [pause 1.5s] It's time to redefine what's possible.`,
      pauseMarkers: `Includes 1s and 1.5s deliberate pauses for cinematic clarity.`,
      emphasisGuide: `Emphasize '${input.productName}', 'overnight', and 'redefine what's possible' with a warm, confident cadence.`,
      estimatedDuration: `18 Seconds`,
    };
  }
}
