"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
exports.getAIProvider = getAIProvider;
const mockProvider_1 = require("./mockProvider");
const openai_1 = require("./openai");
class GeminiProvider {
    name = 'GeminiProvider';
    fallback = new mockProvider_1.MockAIProvider();
    async generateCampaignContent(input) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.log('Gemini API key missing. Using Mock Provider fallback.');
            return this.fallback.generateCampaignContent(input);
        }
        return this.fallback.generateCampaignContent(input);
    }
    async regenerateSingleFormat(type, input) {
        return this.fallback.regenerateSingleFormat(type, input);
    }
}
exports.GeminiProvider = GeminiProvider;
function getAIProvider() {
    const providerType = process.env.AI_PROVIDER || 'mock';
    if (providerType === 'openai') {
        return new openai_1.OpenAIProvider();
    }
    else if (providerType === 'gemini') {
        return new GeminiProvider();
    }
    return new mockProvider_1.MockAIProvider();
}
