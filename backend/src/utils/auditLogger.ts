import sql from 'mssql';
import { Request } from 'express';
import { getDbConnection } from '../config/database';

export const registrarEventoAuditoria = async (
    emailUsuario: string | null,
    accion: string,
    detalle: string,
    req: Request
): Promise<void> => {
    try {
        // Extraemos la IP del cliente de forma confiable
        const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

        const pool = await getDbConnection();

        // Ejecutamos el SP de auditoría de forma parametrizada
        await pool.request()
            .input('EmailUsuario', sql.NVarChar(100), emailUsuario)
            .input('Accion', sql.NVarChar(100), accion)
            .input('Detalle', sql.NVarChar(500), detalle)
            .input('IP', sql.NVarChar(50), ip)
            .execute('Seguridad.usp_RegistrarAuditoria');

    } catch (error) {
        // En ciberseguridad, los fallos de logs no deben tirar la app, sino reportarse en la consola del servidor
        console.error('❌ Error al escribir en el AuditLog:', error);
    }
};
