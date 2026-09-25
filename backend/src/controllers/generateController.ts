import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { getAIProvider } from '../services/gemini';
import { prisma } from '../prisma/client';

export const generateContent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const input = req.body;
    const provider = getAIProvider();
    const outputs = await provider.generateCampaignContent(input);
    res.json({ provider: provider.name, outputs });
  } catch (error: any) {
    res.status(500).json({ message: 'Generation failed.' });
  }
};

export const regenerateFormat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { campaignId, type, input } = req.body;
    const provider = getAIProvider();
    const singleOutput = await provider.regenerateSingleFormat(type, input);

    if (campaignId) {
      const existing = await prisma.generatedContent.findFirst({
        where: { campaignId, type },
      });

      if (existing) {
        await prisma.generatedContent.update({
          where: { id: existing.id },
          data: {
            content: JSON.stringify(singleOutput),
            version: existing.version + 1,
          },
        });
      }
    }

    res.json({ message: 'Format regenerated.', type, output: singleOutput });
  } catch (error: any) {
    res.status(500).json({ message: 'Regeneration failed.' });
  }
};
