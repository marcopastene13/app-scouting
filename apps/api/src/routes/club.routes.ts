import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getClubById, createClub, updateClub } from "../controllers/club.controller";
const router = Router();
router.get('/:id', authenticate, getClubById);
router.post('/', authenticate, createClub);
router.put('/:id', authenticate, updateClub);
export default router;
