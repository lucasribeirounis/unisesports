import { Router } from 'express';
import { updateFlowStatus, getFlowStatus } from '../controllers/flowController.js';

const router = Router();

router.get('/', getFlowStatus);
router.put('/:participant_id', updateFlowStatus);

export default router;
