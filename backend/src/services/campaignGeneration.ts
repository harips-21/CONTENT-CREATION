import { prisma } from '../prisma/client';
import { getAIProvider } from './gemini';
import { CampaignPromptInput } from './aiProvider';

export async function generateAndPersistCampaign(input: CampaignPromptInput, userId: string) {
  const provider = getAIProvider();
  const generatedOutputs = await provider.generateCampaignContent(input);

  const persisted = await prisma.$transaction(async (transaction) => {
    const campaign = await transaction.campaign.create({
      data: {
        userId,
        brandName: input.brandName,
        productName: input.productName,
        industry: input.industry || 'General',
        audience: input.audience,
        goal: input.goal,
        tone: input.tone,
        platform: input.platform,
        keywords: input.keywords,
        competitors: input.competitors,
        callToAction: input.callToAction,
      },
    });

    const contents: Record<string, any> = {};
    for (const [type, content] of Object.entries(generatedOutputs)) {
      const saved = await transaction.generatedContent.create({
        data: {
          campaignId: campaign.id,
          type,
          content: JSON.stringify(content),
          version: 1,
        },
      });
      contents[type] = {
        id: saved.id,
        campaignId: saved.campaignId,
        type: saved.type,
        content,
        version: saved.version,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
      };
    }

    return { campaign, contents };
  });

  console.log('[AI] Generation saved');
  return { provider: provider.name, ...persisted };
}