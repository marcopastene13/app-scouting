import { Router } from 'express';
import {
  createPlayer,
  getPlayers,
  getPlayerById,
  updatePlayer,
  addVideo,
  getHistory,
} from '../controllers/player.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createPlayer);
router.get('/', getPlayers);
router.get('/:id', getPlayerById);
router.put('/:id', updatePlayer);
router.post('/:id/videos', addVideo);
router.get('/:id/history', getHistory);

export default router;
