import { Router } from 'express';
import { createNeed, getNeeds, getMyNeeds, updateNeed, deleteNeed } from '../controllers/need.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createNeed);
router.get('/', getNeeds);
router.get('/me', getMyNeeds);
router.put('/:id', updateNeed);
router.delete('/:id', deleteNeed);

export default router;
