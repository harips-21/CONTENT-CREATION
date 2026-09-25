import { Router } from 'express';
import { generateContent, regenerateFormat } from '../controllers/generateController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, generateContent);
router.put('/regenerate', authenticateToken, regenerateFormat);

export default router;
