"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIProviderError = void 0;
class AIProviderError extends Error {
    statusCode;
    constructor(message, statusCode = 502) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AIProviderError';
    }
}
exports.AIProviderError = AIProviderError;
