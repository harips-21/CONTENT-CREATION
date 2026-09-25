import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import campaignRoutes from './routes/campaignRoutes';
import generateRoutes from './routes/generateRoutes';
import historyRoutes from './routes/historyRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    app: 'AI Content Studio API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
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
});

export default app;
