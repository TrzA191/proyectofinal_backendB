import { Request, Response } from 'express';
import sql from 'mssql';
import { getDbConnection } from '../config/database';

// ⚠ FASE 0: Login Vulnerable
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email y contraseña requeridos' });
            return;
        }

        const pool = await getDbConnection();

        // ⚠ FASE 0: Llama al SP que valida contraseña en texto plano sin hash
        const result = await pool.request()
            .input('Email', sql.NVarChar(100), email)
            .input('Password', sql.NVarChar(100), password)
            .execute('Seguridad.usp_Login');

        if (result.recordset.length === 0) {
            // Error genérico o revelador
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }

        const usuario = result.recordset[0];

        // ⚠ FASE 0: Devuelve los datos del usuario directamente (incluida la contraseña que devuelve el SP)
        res.json({
            mensaje: 'Login exitoso (Fase 0)',
            usuario: {
                usuarioGuid: usuario.UsuarioGuid,
                nombreCompleto: usuario.NombreCompleto,
                email: usuario.Email,
                rol: usuario.Rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
