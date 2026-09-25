"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAIProvider = void 0;
class MockAIProvider {
    name = 'MockAIProvider';
    async generateCampaignContent(input) {
        const cta = input.callToAction || `Discover ${input.productName} today!`;
        return {
            CAPTION: {
                caption: `✨ Transform how you experience ${input.productName} by ${input.brandName}.\n\nBuilt for ${input.audience}, this game-changing innovation delivers a ${input.tone.toLowerCase()} experience that drives ${input.goal.toLowerCase()} results.\n\n👉 ${cta}`,
                callToAction: cta,
                characterCount: 185,
            },
            HASHTAGS: {
                trending: [`#${input.industry.replace(/\s+/g, '')}2026`, '#InnovationInMotion', '#TrendingTech'],
                niche: [`#${input.brandName.replace(/\s+/g, '')}`, `#${input.productName.replace(/\s+/g, '')}`],
                brand: [`#${input.brandName.replace(/\s+/g, '')}Official`],
                campaign: [`#${input.brandName.replace(/\s+/g, '')}${input.goal.replace(/\s+/g, '')}`],
            },
            AD_COPY: {
                headline: `Experience ${input.productName} by ${input.brandName}`,
                primaryText: `Engineered for ${input.audience} seeking premium ${input.industry} solutions. ${input.productName} delivers unmatched performance with a ${input.tone.toLowerCase()} design.`,
                callToAction: cta,
                shortAd: `Transform your ${input.industry} routine with ${input.productName}.`,
                longAd: `Why settle for ordinary ${input.industry} products when you can elevate your results with ${input.productName}? Built by ${input.brandName} specifically for ${input.audience}. Try it today.`,
            },
            BLOG: {
                title: `The Ultimate Guide to ${input.productName}: Transforming ${input.industry} in 2026`,
                seoOutline: ['1. Introduction', '2. Key Features', '3. Audience Impact', '4. Conclusion'],
                introduction: `In an era of fast innovation, ${input.brandName} introduces ${input.productName} to meet the growing needs of ${input.audience}.`,
                sections: [
                    {
                        heading: `Why ${input.productName} Is a Game-Changer`,
                        body: `Designed with a ${input.tone.toLowerCase()} approach, ${input.productName} solves key challenges in ${input.industry}.`,
                    },
                ],
                conclusion: `In conclusion, ${input.productName} sets a new standard for ${input.audience}.`,
            },
            EMAIL: {
                subjectLine: `VIP Early Access: Introducing ${input.productName} 🚀`,
                previewText: `Be among the first to experience ${input.brandName}'s newest breakthrough.`,
                body: `Hi {{First_Name}},\n\nWe are excited to share ${input.productName} with you!\n\nEngineered for ${input.audience}, it combines a ${input.tone.toLowerCase()} design with high-impact results.\n\nClick below to claim your early access privilege:`,
                callToAction: cta,
            },
            IMAGE_PROMPT: {
                prompt: `Commercial hero photography of ${input.productName} by ${input.brandName}, dark glass pedestal, neon blue rim lighting, 8k resolution, cinematic depth of field`,
                lighting: 'Studio key light with vibrant blue-purple rim illumination',
                composition: 'Rule of thirds centered macro shot',
                colors: 'Obsidian black, metallic silver, glowing cyan accent',
                cameraAngle: '35-degree elevated perspective',
                style: 'Commercial 3D render, Octane style',
                targetTools: ['Midjourney v6', 'DALL-E 3', 'Stable Diffusion'],
            },
            VIDEO_SCRIPT: {
                title: `${input.brandName} - 30s TikTok Script`,
                duration: '25 Seconds',
                hook: `Stop scrolling if you care about your ${input.industry} results!`,
                scenes: [
                    {
                        time: '0:00 - 0:05',
                        visualHook: 'Close up of frustration with old tools',
                        onScreenText: 'TIRED OF OLD TOOLS?',
                        voiceOver: `Are you still using outdated tools for your ${input.industry} goals?`,
                    },
                    {
                        time: '0:05 - 0:25',
                        visualHook: `Reveal of ${input.productName}`,
                        onScreenText: `MEET ${input.productName.toUpperCase()}`,
                        voiceOver: `Meet ${input.productName}. Tap below to order now!`,
                    },
                ],
                callToAction: cta,
            },
            VOICE_OVER: {
                narration: `What if you could transform your ${input.industry} journey overnight? [pause 1s] Meet ${input.productName} by ${input.brandName}. [pause 1.5s] Redefine what's possible.`,
                pauseMarkers: 'Includes 1s and 1.5s deliberate pauses.',
                emphasisGuide: `Emphasize ${input.productName} with a warm, confident cadence.`,
                estimatedDuration: '18 Seconds',
            },
        };
    }
    async regenerateSingleFormat(type, input) {
        const full = await this.generateCampaignContent(input);
        return full[type] || full.CAPTION;
    }
}
exports.MockAIProvider = MockAIProvider;
