"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const campaignRoutes_1 = __importDefault(require("./routes/campaignRoutes"));
const generateRoutes_1 = __importDefault(require("./routes/generateRoutes"));
const historyRoutes_1 = __importDefault(require("./routes/historyRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        app: 'AI Content Studio API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/campaigns', campaignRoutes_1.default);
app.use('/api/generate', generateRoutes_1.default);
app.use('/api/history', historyRoutes_1.default);
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});
app.listen(PORT, () => {
    console.log(`🚀 AI Content Studio Backend listening on http://localhost:${PORT}`);
});
exports.default = app;
