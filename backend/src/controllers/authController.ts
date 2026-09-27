import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getDbConnection } from '../config/database';
import { generarToken } from '../services/jwtService';

export const login = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                error: 'Email y contraseña requeridos'
            });
            return;
        }

        const pool = await getDbConnection();

        const result = await pool.request()
            .input('Email', email)
            .execute('Seguridad.usp_ObtenerUsuarioPorEmail');

        if (result.recordset.length === 0) {
            res.status(401).json({
                error: 'Credenciales inválidas'
            });
            return;
        }

        const usuario = result.recordset[0];

        const passwordValida = await bcrypt.compare(
            password,
            usuario.PasswordHash
        );

        if (!passwordValida) {
            res.status(401).json({
                error: 'Credenciales inválidas'
            });
            return;
        }

        const token = generarToken({
            usuarioGuid: usuario.UsuarioGuid,
            email: usuario.Email,
            rol: usuario.Rol
        });

        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                usuarioGuid: usuario.UsuarioGuid,
                nombreCompleto: usuario.NombreCompleto,
                email: usuario.Email,
                rol: usuario.Rol
            }
        });

    } catch (error) {
        console.error('Error en login:', error);

        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};