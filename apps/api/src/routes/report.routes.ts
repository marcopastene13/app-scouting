import { Router } from 'express';
import { createReport, getReportsByPlayer, getMyReports, updateReport, deleteReport } from '../controllers/report.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createReport);
router.get('/me', getMyReports);
router.get('/player/:playerId', getReportsByPlayer);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);

export default router;
