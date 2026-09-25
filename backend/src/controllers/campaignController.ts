import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { prisma } from '../prisma/client';
import { getAIProvider } from '../services/gemini';

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

    // 1. Save campaign in DB
    const campaign = await prisma.campaign.create({
      data: {
        userId,
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
      },
    });

    // 2. Generate content via AI Provider
    const aiProvider = getAIProvider();
    const generatedOutputs = await aiProvider.generateCampaignContent({
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
    });

    // 3. Save contents in DB
    const createdContents: Record<string, any> = {};

    for (const [type, payload] of Object.entries(generatedOutputs)) {
      const dbContent = await prisma.generatedContent.create({
        data: {
          campaignId: campaign.id,
          type,
          content: JSON.stringify(payload),
          version: 1,
        },
      });

      createdContents[type] = {
        id: dbContent.id,
        campaignId: dbContent.campaignId,
        type: dbContent.type,
        content: payload,
        version: dbContent.version,
        createdAt: dbContent.createdAt,
        updatedAt: dbContent.updatedAt,
      };
    }

    res.status(201).json({
      message: 'Campaign created and content generated successfully.',
      campaign,
      contents: createdContents,
    });
  } catch (error: any) {
    console.error('Create campaign error:', error);
    res.status(500).json({ message: 'Error creating campaign.' });
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
    const { id } = req.params;

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
    const { id } = req.params;
    await prisma.campaign.delete({ where: { id } });
    res.json({ message: 'Campaign deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting campaign.' });
  }
};
