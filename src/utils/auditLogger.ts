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
        await pool.execute('CALL Seguridad_usp_RegistrarAuditoria(?, ?, ?, ?)', [
            emailUsuario, accion, detalle, ip
        ]);

    } catch (error) {
        // En ciberseguridad, los fallos de logs no deben tirar la app, sino reportarse en la consola del servidor
        console.error('❌ Error al escribir en el AuditLog:', error);
    }
};
