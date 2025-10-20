import express from 'express';
import { 
  getClientes, 
  getCliente, 
  createCliente, 
  updateCliente, 
  deleteCliente 
} from '../controllers/clienteController.js';

const router = express.Router();

router.get('/', getClientes);
router.get('/:id', getCliente);
router.post('/', createCliente);
router.put('/:id', updateCliente);
router.delete('/:id', deleteCliente);

export default router;