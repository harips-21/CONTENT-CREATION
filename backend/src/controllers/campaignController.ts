import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { prisma } from '../prisma/client';
import { AIProviderError } from '../services/aiProvider';
import { generateAndPersistCampaign } from '../services/campaignGeneration';

export const createCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'demo-user-123';
    const {
      brandName,
      productName,
      industry = 'General',
      audience,
      goal,
      tone,
      platform,
      keywords,
      competitors,
      callToAction,
    } = req.body;

    if (!brandName || !productName || !audience || !goal || !tone || !platform) {
      res.status(400).json({ message: 'Missing required campaign fields.' });
      return;
    }

    const generated = await generateAndPersistCampaign({
      brandName,
      productName,
      industry,
      audience,
      goal,
      tone,
      platform,
      keywords,
      competitors,
      callToAction,
      }, userId);

    res.status(201).json({
      message: 'Campaign created and content generated successfully.',
      ...generated,
    });
  } catch (error: any) {
    if (error instanceof AIProviderError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error('Create campaign failed:', error instanceof Error ? error.message : 'Unexpected error');
    res.status(500).json({ message: 'Unable to create the campaign right now. Please try again.' });
  }
};

export const getCampaigns = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'demo-user-123';

    const campaigns = await prisma.campaign.findMany({
      where: { userId },
      include: { contents: true },
      orderBy: { createdAt: 'desc' },
    });

    // Format output
    const formatted = campaigns.map((c: any) => {
      const contentsMap: Record<string, any> = {};
      c.contents.forEach((item: any) => {
        try {
          contentsMap[item.type] = {
            ...item,
            content: JSON.parse(item.content),
          };
        } catch {
          contentsMap[item.type] = item;
        }
      });

      return {
        campaign: {
          id: c.id,
          userId: c.userId,
          brandName: c.brandName,
          productName: c.productName,
          industry: c.industry,
          audience: c.audience,
          goal: c.goal,
          tone: c.tone,
          platform: c.platform,
          keywords: c.keywords,
          competitors: c.competitors,
          callToAction: c.callToAction,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        },
        contents: contentsMap,
      };
    });

    res.json({ campaigns: formatted });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching campaigns.' });
  }
};

export const getCampaignById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);

    const c = await prisma.campaign.findUnique({
      where: { id },
      include: { contents: true },
    });

    if (!c) {
      res.status(404).json({ message: 'Campaign not found.' });
      return;
    }

    const contentsMap: Record<string, any> = {};
    c.contents.forEach((item: any) => {
      try {
        contentsMap[item.type] = {
          ...item,
          content: JSON.parse(item.content),
        };
      } catch {
        contentsMap[item.type] = item;
      }
    });

    res.json({
      campaign: c,
      contents: contentsMap,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching campaign.' });
  }
};

export const deleteCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await prisma.campaign.delete({ where: { id } });
    res.json({ message: 'Campaign deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting campaign.' });
  }
};

export const updateGeneratedContent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaignId = String(req.params.id);
    const type = String(req.params.type);
    const allowedTypes = ['CAPTION', 'HASHTAGS', 'AD_COPY', 'BLOG', 'EMAIL', 'IMAGE_PROMPT', 'VIDEO_SCRIPT', 'VOICE_OVER'];
    const { content } = req.body;

    if (!allowedTypes.includes(type) || content === undefined || content === null) {
      res.status(400).json({ message: 'A valid content format and content value are required.' });
      return;
    }

    const existing = await prisma.generatedContent.findFirst({ where: { campaignId, type } });
    if (!existing) {
      res.status(404).json({ message: 'Generated content was not found.' });
      return;
    }

    const updated = await prisma.generatedContent.update({
      where: { id: existing.id },
      data: { content: JSON.stringify(content), version: existing.version + 1 },
    });

    res.json({
      content,
      version: updated.version,
      updatedAt: updated.updatedAt,
    });
  } catch (error: any) {
    console.error('Save generated content failed:', error instanceof Error ? error.message : 'Unexpected error');
    res.status(500).json({ message: 'Unable to save this content right now. Please try again.' });
  }
};
