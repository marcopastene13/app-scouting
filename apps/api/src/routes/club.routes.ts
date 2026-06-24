import { Router } from 'express';
import { createClub, updateClub, getMyClub } from '../controllers/club.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createClub);
router.put('/:id', updateClub);
router.get('/me', getMyClub);

export default router;
