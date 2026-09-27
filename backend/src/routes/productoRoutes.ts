import { Router } from 'express';
import { buscarProductos, obtenerHistorialCompras, crearProducto, registrarCompra } from '../controllers/productoController';
import { verificarToken, requerirRol } from '../middlewares/authMiddleware';

const router = Router();

// Ruta de búsqueda: Cualquier usuario autenticado puede buscar
router.get('/buscar', verificarToken, buscarProductos);

// Ruta de historial: Requiere token (y el controlador valida Anti-IDOR)
router.get('/historial/:usuarioGuid', verificarToken, obtenerHistorialCompras);

// Ruta de compra: Cualquier cliente autenticado puede realizar una compra (El usuarioGuid se toma del JWT)
router.post('/comprar', verificarToken, registrarCompra);

// Ruta de creación: Requiere estar autenticado Y poseer el rol 'Administrador'
router.post('/crear', verificarToken, requerirRol(['Administrador']), crearProducto);

export default router;
