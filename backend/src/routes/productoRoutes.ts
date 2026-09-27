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

// Buscar productos:
// Requiere autenticación + límite de solicitudes
router.get(
    '/buscar',
    autenticar,
    searchRateLimiter,
    buscarProductos
);

// Historial de compras:
// El usuarioGuid se obtiene directamente del JWT,
// evitando que el cliente pueda consultar el historial de otro usuario.
router.get(
    '/historial',
    autenticar,
    obtenerHistorialCompras
);

// Registrar compra:
// El usuarioGuid se obtiene directamente del JWT.
router.post(
    '/comprar',
    autenticar,
    registrarCompra
);

// Crear producto:
// Requiere autenticación y rol de Administrador.
router.post(
    '/crear',
    autenticar,
    autorizarRoles('Administrador', 'Admin'),
    crearProducto
);

export default router;