"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGeneratedContent = exports.deleteCampaign = exports.getCampaignById = exports.getCampaigns = exports.createCampaign = void 0;
const client_1 = require("../prisma/client");
const aiProvider_1 = require("../services/aiProvider");
const campaignGeneration_1 = require("../services/campaignGeneration");
const createCampaign = async (req, res) => {
    try {
        const userId = req.user?.id || 'demo-user-123';
        const { brandName, productName, industry = 'General', audience, goal, tone, platform, keywords, competitors, callToAction, } = req.body;
        if (!brandName || !productName || !audience || !goal || !tone || !platform) {
            res.status(400).json({ message: 'Missing required campaign fields.' });
            return;
        }
        const generated = await (0, campaignGeneration_1.generateAndPersistCampaign)({
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
    }
    catch (error) {
        if (error instanceof aiProvider_1.AIProviderError) {
            res.status(error.statusCode).json({ message: error.message });
            return;
        }
        console.error('Create campaign failed:', error instanceof Error ? error.message : 'Unexpected error');
        res.status(500).json({ message: 'Unable to create the campaign right now. Please try again.' });
    }
};
exports.createCampaign = createCampaign;
const getCampaigns = async (req, res) => {
    try {
        const userId = req.user?.id || 'demo-user-123';
        const campaigns = await client_1.prisma.campaign.findMany({
            where: { userId },
            include: { contents: true },
            orderBy: { createdAt: 'desc' },
        });
        // Format output
        const formatted = campaigns.map((c) => {
            const contentsMap = {};
            c.contents.forEach((item) => {
                try {
                    contentsMap[item.type] = {
                        ...item,
                        content: JSON.parse(item.content),
                    };
                }
                catch {
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching campaigns.' });
    }
};
exports.getCampaigns = getCampaigns;
const getCampaignById = async (req, res) => {
    try {
        const id = String(req.params.id);
        const c = await client_1.prisma.campaign.findUnique({
            where: { id },
            include: { contents: true },
        });
        if (!c) {
            res.status(404).json({ message: 'Campaign not found.' });
            return;
        }
        const contentsMap = {};
        c.contents.forEach((item) => {
            try {
                contentsMap[item.type] = {
                    ...item,
                    content: JSON.parse(item.content),
                };
            }
            catch {
                contentsMap[item.type] = item;
            }
        });
        res.json({
            campaign: c,
            contents: contentsMap,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching campaign.' });
    }
};
exports.getCampaignById = getCampaignById;
const deleteCampaign = async (req, res) => {
    try {
        const id = String(req.params.id);
        await client_1.prisma.campaign.delete({ where: { id } });
        res.json({ message: 'Campaign deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting campaign.' });
    }
};
exports.deleteCampaign = deleteCampaign;
const updateGeneratedContent = async (req, res) => {
    try {
        const campaignId = String(req.params.id);
        const type = String(req.params.type);
        const allowedTypes = ['CAPTION', 'HASHTAGS', 'AD_COPY', 'BLOG', 'EMAIL', 'IMAGE_PROMPT', 'VIDEO_SCRIPT', 'VOICE_OVER'];
        const { content } = req.body;
        if (!allowedTypes.includes(type) || content === undefined || content === null) {
            res.status(400).json({ message: 'A valid content format and content value are required.' });
            return;
        }
        const existing = await client_1.prisma.generatedContent.findFirst({ where: { campaignId, type } });
        if (!existing) {
            res.status(404).json({ message: 'Generated content was not found.' });
            return;
        }
        const updated = await client_1.prisma.generatedContent.update({
            where: { id: existing.id },
            data: { content: JSON.stringify(content), version: existing.version + 1 },
        });
        res.json({
            content,
            version: updated.version,
            updatedAt: updated.updatedAt,
        });
    }
    catch (error) {
        console.error('Save generated content failed:', error instanceof Error ? error.message : 'Unexpected error');
        res.status(500).json({ message: 'Unable to save this content right now. Please try again.' });
    }
};
exports.updateGeneratedContent = updateGeneratedContent;
