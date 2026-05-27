import { Router } from 'express';
import { 
    createParticipant, 
    getPublicParticipants, 
    deleteParticipant 
} from '../controllers/participantController.js';

const router = Router();

router.get('/', getPublicParticipants);
router.post('/', createParticipant);
router.delete('/:id', deleteParticipant);

export default router;
