import express from 'express';
import { 
  getProductosConCategorias, 
  getProducto, 
  createProducto, 
  updateProducto, 
  deleteProducto,
   getCategorias
} from '../controllers/productoController.js';

const router = express.Router();

router.get('/', getProductosConCategorias);
router.get('/categorias', getCategorias);
router.get('/:id', getProducto);
router.post('/', createProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

export default router;