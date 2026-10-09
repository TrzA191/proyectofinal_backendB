
import sql from 'mssql';
import { getDbConnection } from '../config/database';

interface RegistrarAuditoriaParams {
    emailUsuario?: string | null;
    accion: string;
    detalle?: string | null;
    ip?: string | null;
}

export const registrarAuditoria = async ({
    emailUsuario = null,
    accion,
    detalle = null,
    ip = null
}: RegistrarAuditoriaParams): Promise<void> => {
    try {
        const pool = await getDbConnection();

        await pool.request()
            .input('EmailUsuario', sql.NVarChar(100), emailUsuario)
            .input('Accion', sql.NVarChar(100), accion)
            .input('Detalle', sql.NVarChar(500), detalle)
            .input('IP', sql.NVarChar(50), ip)
            .execute('Seguridad.usp_RegistrarAuditoria');

    } catch (error) {
        console.error('Error al registrar auditoría:', error);
    }
};

