import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getNeeds, createNeed, applyToNeed } from "../controllers/need.controller";
const router = Router();
router.get('/', getNeeds);
router.post('/', authenticate, createNeed);
router.post('/:id/apply', authenticate, applyToNeed);
export default router;
