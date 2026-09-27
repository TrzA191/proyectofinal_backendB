import { Router } from 'express';
import {
    buscarProductos,
    crearProducto,
    obtenerHistorialCompras
} from '../controllers/productoController';

import {
    autenticar,
    autorizarRoles
} from '../middleware/authMiddleware';

import { searchRateLimiter } from '../middleware/rateLimitMiddleware';

const router = Router();

router.get(
    '/buscar',
    autenticar,
    buscarProductos
);

router.get(
    '/historial',
    autenticar,
    obtenerHistorialCompras
);

router.post(
    '/crear',
    autenticar,
    autorizarRoles('Administrador', 'Admin'),
    crearProducto
);

router.get(
    '/buscar',
    autenticar,
    searchRateLimiter,
    buscarProductos
);

export default router;
