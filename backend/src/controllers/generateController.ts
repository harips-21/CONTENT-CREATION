import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { getAIProvider } from '../services/gemini';
import { AIProviderError } from '../services/aiProvider';
import { prisma } from '../prisma/client';
import { generateAndPersistCampaign } from '../services/campaignGeneration';

const CONTENT_TYPES = ['CAPTION', 'HASHTAGS', 'AD_COPY', 'BLOG', 'EMAIL', 'IMAGE_PROMPT', 'VIDEO_SCRIPT', 'VOICE_OVER'];

export const generateContent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const input = req.body;
    if (!input?.brandName || !input?.productName || !input?.audience || !input?.goal || !input?.tone || !input?.platform) {
      res.status(400).json({ message: 'Brand, product, audience, goal, tone, and platform are required.' });
      return;
    }

    console.log('[AI] Generate request received');
    const generated = await generateAndPersistCampaign(input, req.user?.id || 'demo-user-123');
    res.status(201).json({ message: 'Campaign created and content generated successfully.', ...generated });
  } catch (error: any) {
    if (error instanceof AIProviderError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Unable to generate content right now. Please try again.' });
  }
};

export const regenerateFormat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { campaignId, type, input } = req.body;
    if (!CONTENT_TYPES.includes(type) || !input) {
      res.status(400).json({ message: 'A valid content format and campaign input are required.' });
      return;
    }
    const provider = getAIProvider();
    const singleOutput = await provider.regenerateSingleFormat(type, input);
    let version: number | undefined;

    if (campaignId) {
      const existing = await prisma.generatedContent.findFirst({
        where: { campaignId, type },
      });

      if (!existing) {
        res.status(404).json({ message: 'Generated content was not found.' });
        return;
      }

      const updated = await prisma.generatedContent.update({
        where: { id: existing.id },
        data: {
          content: JSON.stringify(singleOutput),
          version: existing.version + 1,
        },
      });
      version = updated.version;
    }

    res.json({ message: 'Format regenerated.', type, output: singleOutput, version });
  } catch (error: any) {
    if (error instanceof AIProviderError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Unable to regenerate content right now. Please try again.' });
  }
};
