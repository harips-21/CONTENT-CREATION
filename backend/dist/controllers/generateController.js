"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regenerateFormat = exports.generateContent = void 0;
const gemini_1 = require("../services/gemini");
const aiProvider_1 = require("../services/aiProvider");
const client_1 = require("../prisma/client");
const campaignGeneration_1 = require("../services/campaignGeneration");
const CONTENT_TYPES = ['CAPTION', 'HASHTAGS', 'AD_COPY', 'BLOG', 'EMAIL', 'IMAGE_PROMPT', 'VIDEO_SCRIPT', 'VOICE_OVER'];
const generateContent = async (req, res) => {
    try {
        const input = req.body;
        if (!input?.brandName || !input?.productName || !input?.audience || !input?.goal || !input?.tone || !input?.platform) {
            res.status(400).json({ message: 'Brand, product, audience, goal, tone, and platform are required.' });
            return;
        }
        console.log('[AI] Generate request received');
        const generated = await (0, campaignGeneration_1.generateAndPersistCampaign)(input, req.user?.id || 'demo-user-123');
        res.status(201).json({ message: 'Campaign created and content generated successfully.', ...generated });
    }
    catch (error) {
        if (error instanceof aiProvider_1.AIProviderError) {
            res.status(error.statusCode).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: 'Unable to generate content right now. Please try again.' });
    }
};
exports.generateContent = generateContent;
const regenerateFormat = async (req, res) => {
    try {
        const { campaignId, type, input } = req.body;
        if (!CONTENT_TYPES.includes(type) || !input) {
            res.status(400).json({ message: 'A valid content format and campaign input are required.' });
            return;
        }
        const provider = (0, gemini_1.getAIProvider)();
        const singleOutput = await provider.regenerateSingleFormat(type, input);
        let version;
        if (campaignId) {
            const existing = await client_1.prisma.generatedContent.findFirst({
                where: { campaignId, type },
            });
            if (!existing) {
                res.status(404).json({ message: 'Generated content was not found.' });
                return;
            }
            const updated = await client_1.prisma.generatedContent.update({
                where: { id: existing.id },
                data: {
                    content: JSON.stringify(singleOutput),
                    version: existing.version + 1,
                },
            });
            version = updated.version;
        }
        res.json({ message: 'Format regenerated.', type, output: singleOutput, version });
    }
    catch (error) {
        if (error instanceof aiProvider_1.AIProviderError) {
            res.status(error.statusCode).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: 'Unable to regenerate content right now. Please try again.' });
    }
};
exports.regenerateFormat = regenerateFormat;
