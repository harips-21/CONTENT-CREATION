import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import campaignRoutes from './routes/campaignRoutes';
import generateRoutes from './routes/generateRoutes';
import historyRoutes from './routes/historyRoutes';
import { getAIStatusInfo } from './services/gemini';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health & AI Status Check
app.get('/api/health', (req: Request, res: Response) => {
  const aiStatus = getAIStatusInfo();
  res.json({
    status: 'online',
    app: 'AI Content Studio API',
    version: '2.0.0',
    aiStatus: aiStatus.status,
    provider: aiStatus.provider,
    model: aiStatus.model,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/status', (req: Request, res: Response) => {
  const aiStatus = getAIStatusInfo();
  res.json(aiStatus);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/history', historyRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Content Studio Backend listening on http://localhost:${PORT}`);
  console.log(`🤖 AI Provider Status: ${getAIStatusInfo().status}`);
});

export default app;
