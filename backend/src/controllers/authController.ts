import { Request, Response } from 'express';
import sql from 'mssql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDbConnection } from '../config/database';
import { registrarEventoAuditoria } from '../utils/auditLogger';

// Contador en memoria para intentos fallidos por email
const intentosFallidosMap: Map<string, number> = new Map();

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Credenciales incompletas' });
            return;
        }

        const pool = await getDbConnection();

        const result = await pool.request()
            .input('Email', sql.NVarChar(100), email)
            .execute('Seguridad.usp_ObtenerUsuarioPorEmail');

        // Si el usuario no existe o la contraseña falla
        if (result.recordset.length === 0) {
            await manejarIntentoFallido(email, req);
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }

        const usuario = result.recordset[0];
        const passwordValida = await bcrypt.compare(password, usuario.PasswordHash) || (password === usuario.PasswordHash);

        if (!passwordValida) {
            await manejarIntentoFallido(email, req);
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }

        // 🔐 Login Exitoso: Reiniciamos el contador de fallos y registramos auditoría
        intentosFallidosMap.delete(email);
        await registrarEventoAuditoria(
            email,
            'LOGIN_EXITOSO',
            `Inicio de sesión correcto para el rol [${usuario.Rol}]`,
            req
        );

        // Generar Token JWT (1 hora)
        const secret = process.env.JWT_SECRET || 'secreto_super_seguro_123';
        const token = jwt.sign(
            { usuarioGuid: usuario.UsuarioGuid, email: usuario.Email, rol: usuario.Rol },
            secret,
            { expiresIn: '1h' }
        );

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
        res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud' });
    }
};

// Función auxiliar para contar fallos y auditar al tercer intento
const manejarIntentoFallido = async (email: string, req: Request) => {
    const intentosActuales = (intentosFallidosMap.get(email) || 0) + 1;
    intentosFallidosMap.set(email, intentosActuales);

    // Registro simple del fallo
    await registrarEventoAuditoria(
        email,
        'LOGIN_FALLIDO',
        `Intento fallido #${intentosActuales} de contraseña o usuario inexistente`,
        req
    );

    // Alerta especial si alcanza 3 o más fallos
    if (intentosActuales >= 3) {
        await registrarEventoAuditoria(
            email,
            'ALERTA_FUERZA_BRUTA',
            `⚠️ Se detectaron ${intentosActuales} intentos fallidos consecutivos para esta cuenta`,
            req
        );
    }

};
