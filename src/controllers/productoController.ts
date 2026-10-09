import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { getDbConnection } from '../config/database';

// ⚠ FASE 0: Búsqueda con concatenación de cadenas (SQL Injection)
export const buscarProductos = async (req: Request, res: Response): Promise<void> => {
    try {
        const filtro = (req.query.filtro as string) || '';

        const pool = await getDbConnection();

        // ⚠ FASE 0: Ejecuta el SP usp_BuscarProductos que concatena dinámicamente el input
        const [rows]: any = await pool.execute('CALL Comercial_usp_BuscarProductos(?)', [filtro]);
        const recordset = rows[0];

        res.json({
            total: recordset.length,
            productos: recordset
        });
    } catch (error) {
        console.error('Error al buscar productos:', error);
        res.status(500).json({ error: 'Error interno al consultar productos' });
    }
};

// 🔐 Historial de compras de forma segura (Anti-IDOR)
export const obtenerHistorialCompras = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const usuarioGuid = req.usuario?.usuarioGuid;

        if (!usuarioGuid) {
            res.status(401).json({ error: 'Usuario no autenticado o token inválido' });
            return;
        }

        const pool = await getDbConnection();

        const [rows]: any = await pool.execute('CALL Comercial_usp_ObtenerHistorialCompras(?)', [usuarioGuid]);
        const recordset = rows[0];

        res.json({
            usuarioGuid,
            historial: recordset
        });
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ error: 'Error interno al consultar historial' });
    }
};

// ⚠ FASE 0: Crear Producto (POST) sin validación de rol (Cualquier usuario puede crear productos)
export const crearProducto = async (req: Request, res: Response): Promise<void> => {
    try {
        const { codigoSKU, nombre, precio, stock } = req.body;

        if (!codigoSKU || !nombre || precio === undefined || stock === undefined) {
            res.status(400).json({ error: 'Todos los campos (codigoSKU, nombre, precio, stock) son requeridos' });
            return;
        }

        const pool = await getDbConnection();

        const [rows]: any = await pool.execute('CALL Comercial_usp_CrearProducto(?, ?, ?, ?)', [
            codigoSKU, nombre, precio, stock
        ]);
        const recordset = rows[0];

        res.status(201).json({
            mensaje: 'Producto creado exitosamente',
            producto: recordset[0]
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Error interno al registrar el producto' });
    }
};


// 🔐 Registrar Compra / Venta (Extrae el UsuarioGuid directamente del JWT para evitar IDOR)
export const registrarCompra = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { productoGuid, cantidad } = req.body;
        const usuarioGuid = req.usuario?.usuarioGuid; // 🔐 Tomado de forma segura del JWT

        if (!productoGuid || !cantidad || cantidad <= 0) {
            res.status(400).json({ error: 'ProductoGuid y cantidad válida son requeridos' });
            return;
        }

        const pool = await getDbConnection();

        const [rows]: any = await pool.execute('CALL Comercial_usp_RegistrarCompraSegura(?, ?, ?)', [
            usuarioGuid, productoGuid, cantidad
        ]);
        const recordset = rows[0];

        res.status(201).json({
            mensaje: 'Compra registrada con éxito',
            detalles: recordset[0]
        });
    } catch (error: any) {
        console.error('Error al registrar compra:', error);
        res.status(400).json({ error: error.message || 'Error al procesar la compra' });
    }
};
