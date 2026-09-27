import { Router } from 'express';

import {
    buscarProductos,
    crearProducto,
    obtenerHistorialCompras,
    registrarCompra
} from '../controllers/productoController';

import {
    autenticar,
    autorizarRoles
} from '../middleware/authMiddleware';

import { searchRateLimiter } from '../middleware/rateLimitMiddleware';

const router = Router();

/**
 * @swagger
 * /api/productos/buscar:
 *   get:
 *     summary: Buscar productos
 *     description: Busca productos mediante un filtro de texto.
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filtro
 *         schema:
 *           type: string
 *         description: Texto utilizado para buscar productos.
 *     responses:
 *       200:
 *         description: Lista de productos encontrados.
 *       401:
 *         description: Autenticación requerida o token inválido.
 *       429:
 *         description: Demasiadas solicitudes.
 */
router.get(
    '/buscar',
    autenticar,
    searchRateLimiter,
    buscarProductos
);

/**
 * @swagger
 * /api/productos/historial:
 *   get:
 *     summary: Consultar historial de compras
 *     description: Obtiene el historial del usuario autenticado utilizando el usuarioGuid contenido en el JWT.
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial de compras del usuario autenticado.
 *       401:
 *         description: Autenticación requerida o token inválido.
 */
router.get(
    '/historial',
    autenticar,
    obtenerHistorialCompras
);

/**
 * @swagger
 * /api/productos/comprar:
 *   post:
 *     summary: Registrar una compra
 *     description: Registra una compra utilizando el usuario autenticado del JWT.
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productoGuid
 *               - cantidad
 *             properties:
 *               productoGuid:
 *                 type: string
 *                 format: uuid
 *                 description: Identificador del producto.
 *               cantidad:
 *                 type: integer
 *                 minimum: 1
 *                 description: Cantidad de productos a comprar.
 *     responses:
 *       201:
 *         description: Compra registrada correctamente.
 *       400:
 *         description: Datos inválidos o error al procesar la compra.
 *       401:
 *         description: Autenticación requerida o token inválido.
 */
router.post(
    '/comprar',
    autenticar,
    registrarCompra
);

/**
 * @swagger
 * /api/productos/crear:
 *   post:
 *     summary: Crear producto
 *     description: Crea un nuevo producto. Requiere autenticación y rol de Administrador.
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
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
 *                 example: SKU-001
 *               nombre:
 *                 type: string
 *                 example: Producto de prueba
 *               precio:
 *                 type: number
 *                 format: double
 *                 example: 99.99
 *               stock:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Producto creado exitosamente.
 *       400:
 *         description: Datos requeridos faltantes.
 *       401:
 *         description: Autenticación requerida o token inválido.
 *       403:
 *         description: El usuario no tiene permisos de administrador.
 */
router.post(
    '/crear',
    autenticar,
    autorizarRoles('Administrador', 'Admin'),
    crearProducto
);

export default router;