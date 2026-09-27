import { Request, Response } from 'express';
import sql from 'mssql';
import { getDbConnection } from '../config/database';

// ⚠ FASE 0: Búsqueda con concatenación de cadenas (SQL Injection)
export const buscarProductos = async (req: Request, res: Response): Promise<void> => {
    try {
        const filtro = (req.query.filtro as string) || '';

        const pool = await getDbConnection();

        // ⚠ FASE 0: Ejecuta el SP usp_BuscarProductos que concatena dinámicamente el input
        const result = await pool.request()
            .input('Filtro', sql.NVarChar(200), filtro)
            .execute('Comercial.usp_BuscarProductos');

        res.json({
            total: result.recordset.length,
            productos: result.recordset
        });
    } catch (error) {
        console.error('Error al buscar productos:', error);
        res.status(500).json({ error: 'Error interno al consultar productos' });
    }
};

// ⚠ FASE 0: Obtener historial de compras (Vulnerable a IDOR)
// No valida si el usuarioAutenticado es dueño de ese UsuarioGuid
export const obtenerHistorialCompras = async (req: Request, res: Response): Promise<void> => {
    try {
        const { usuarioGuid } = req.params;

        if (!usuarioGuid) {
            res.status(400).json({ error: 'UsuarioGuid es requerido' });
            return;
        }

        const pool = await getDbConnection();

        const result = await pool.request()
            .input('UsuarioGuid', sql.UniqueIdentifier, usuarioGuid)
            .execute('Comercial.usp_ObtenerHistorialCompras');

        res.json({
            usuarioGuid,
            historial: result.recordset
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

        const result = await pool.request()
            .input('CodigoSKU', sql.NVarChar(20), codigoSKU)
            .input('Nombre', sql.NVarChar(150), nombre)
            .input('Precio', sql.Decimal(10, 2), precio)
            .input('Stock', sql.Int, stock)
            .execute('Comercial.usp_CrearProducto');

        res.status(201).json({
            mensaje: 'Producto creado exitosamente',
            producto: result.recordset[0]
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Error interno al registrar el producto' });
    }
};
