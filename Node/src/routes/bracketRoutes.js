import { Router } from 'express';
import { getBracket, getAllBrackets, saveBracket, deleteBracket } from '../controllers/bracketController.js';

const router = Router();

router.get('/', getAllBrackets);
router.get('/:game', getBracket);
router.put('/:game', saveBracket);
router.delete('/:game', deleteBracket);

export default router;
