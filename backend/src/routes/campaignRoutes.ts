import { Router } from 'express';
import { createCampaign, getCampaigns, getCampaignById, deleteCampaign, updateGeneratedContent } from '../controllers/campaignController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, createCampaign);
router.get('/', authenticateToken, getCampaigns);
router.get('/:id', authenticateToken, getCampaignById);
router.put('/:id/contents/:type', authenticateToken, updateGeneratedContent);
router.delete('/:id', authenticateToken, deleteCampaign);

export default router;
