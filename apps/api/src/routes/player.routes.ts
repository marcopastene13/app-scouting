import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getPlayers, getPlayerById, createPlayer, updatePlayer } from "../controllers/player.controller";
const router = Router();
router.get('/', authenticate, getPlayers);
router.get('/:id', authenticate, getPlayerById);
router.post('/', authenticate, createPlayer);
router.put('/:id', authenticate, updatePlayer);
export default router;
