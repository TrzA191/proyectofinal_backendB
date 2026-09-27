import { Router } from 'express';
import { buscarProductos, crearProducto, obtenerHistorialCompras } from '../controllers/productoController';

const router = Router();

/**
 * @swagger
 * /api/productos/buscar:
 *   get:
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: filtro
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *     responses:
 *       200:
 *         description: Lista de productos encontrados
 */
router.get('/buscar', buscarProductos);

/**
 * @swagger
 * /api/productos/historial/{usuarioGuid}:
 *   get:
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: usuarioGuid
 *         required: true
 *         schema:
 *           type: string
 *         description: GUID del usuario a consultar
 *     responses:
 *       200:
 *         description: Historial de compras obtenido
 */
router.get('/historial/:usuarioGuid', obtenerHistorialCompras);



/**
 * @swagger
 * /api/productos/crear:
 *   post:
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigoSKU
 *               - nombre
 *               - precio
 *               - stock
 *             properties:
 *               codigoSKU:
 *                 type: string
 *                 example: PROD-013
 *               nombre:
 *                 type: string
 *                 example: Webcam 4K Pro
 *               precio:
 *                 type: number
 *                 example: 129.99
 *               stock:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       201:
 *         description: Producto creado con éxito
 */
router.post('/crear', crearProducto);

export default router;


