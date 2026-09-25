"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regenerateFormat = exports.generateContent = void 0;
const gemini_1 = require("../services/gemini");
const client_1 = require("../prisma/client");
const generateContent = async (req, res) => {
    try {
        const input = req.body;
        const provider = (0, gemini_1.getAIProvider)();
        const outputs = await provider.generateCampaignContent(input);
        res.json({ provider: provider.name, outputs });
    }
    catch (error) {
        res.status(500).json({ message: 'Generation failed.' });
    }
};
exports.generateContent = generateContent;
const regenerateFormat = async (req, res) => {
    try {
        const { campaignId, type, input } = req.body;
        const provider = (0, gemini_1.getAIProvider)();
        const singleOutput = await provider.regenerateSingleFormat(type, input);
        if (campaignId) {
            const existing = await client_1.prisma.generatedContent.findFirst({
                where: { campaignId, type },
            });
            if (existing) {
                await client_1.prisma.generatedContent.update({
                    where: { id: existing.id },
                    data: {
                        content: JSON.stringify(singleOutput),
                        version: existing.version + 1,
                    },
                });
            }
        }
        res.json({ message: 'Format regenerated.', type, output: singleOutput });
    }
    catch (error) {
        res.status(500).json({ message: 'Regeneration failed.' });
    }
};
exports.regenerateFormat = regenerateFormat;
