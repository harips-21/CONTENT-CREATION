"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCampaign = exports.getCampaignById = exports.getCampaigns = exports.createCampaign = void 0;
const client_1 = require("../prisma/client");
const gemini_1 = require("../services/gemini");
const createCampaign = async (req, res) => {
    try {
        const userId = req.user?.id || 'demo-user-123';
        const { brandName, productName, industry = 'General', audience, goal, tone, platform, keywords, competitors, callToAction, } = req.body;
        if (!brandName || !productName || !audience || !goal || !tone || !platform) {
            res.status(400).json({ message: 'Missing required campaign fields.' });
            return;
        }
        // 1. Save campaign in DB
        const campaign = await client_1.prisma.campaign.create({
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
        const aiProvider = (0, gemini_1.getAIProvider)();
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
        const createdContents = {};
        for (const [type, payload] of Object.entries(generatedOutputs)) {
            const dbContent = await client_1.prisma.generatedContent.create({
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
    }
    catch (error) {
        console.error('Create campaign error:', error);
        res.status(500).json({ message: 'Error creating campaign.' });
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
        const { id } = req.params;
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
        const { id } = req.params;
        await client_1.prisma.campaign.delete({ where: { id } });
        res.json({ message: 'Campaign deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting campaign.' });
    }
};
exports.deleteCampaign = deleteCampaign;
