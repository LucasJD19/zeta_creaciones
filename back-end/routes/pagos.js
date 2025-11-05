import express from 'express';
import { 
  getPagos, 
  getPago, 
  createPago, 
  updatePago, 
  deletePago 
} from '../controllers/pagoController.js';

const router = express.Router();

router.get('/', getPagos);
router.get('/:id', getPago);
router.post('/', createPago);
router.put('/:id', updatePago);
router.delete('/:id', deletePago);

export default router;