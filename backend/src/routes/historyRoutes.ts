import { Router } from 'express';
import { getCampaigns } from '../controllers/campaignController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getCampaigns);

export default router;
