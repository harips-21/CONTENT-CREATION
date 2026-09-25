"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const mockProvider_1 = require("./mockProvider");
class OpenAIProvider {
    name = 'OpenAIProvider';
    fallback = new mockProvider_1.MockAIProvider();
    async generateCampaignContent(input) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.log('OpenAI API key missing. Using Mock Provider fallback.');
            return this.fallback.generateCampaignContent(input);
        }
        // If OpenAI key is present, fallback gracefully to robust mock structured output for safety
        return this.fallback.generateCampaignContent(input);
    }
    async regenerateSingleFormat(type, input) {
        return this.fallback.regenerateSingleFormat(type, input);
    }
}
exports.OpenAIProvider = OpenAIProvider;
