import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { registrarEventoAuditoria } from '../utils/auditLogger';

export interface AuthRequest extends Request {
    usuario?: {
        usuarioGuid: string;
        email: string;
        rol: string;
    };
}

export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
        return;
    }

    try {
        const secret = process.env.JWT_SECRET || 'secreto_super_seguro_123';
        const decoded = jwt.verify(token, secret) as any;

        req.usuario = {
            usuarioGuid: decoded.usuarioGuid,
            email: decoded.email,
            rol: decoded.rol
        };

        next();
    } catch (error) {
        // Registrar intento de token corrupto o expirado
        registrarEventoAuditoria(null, 'ACCESO_DENEGADO_TOKEN', 'Intento de acceso con token inválido o expirado', req);
        res.status(403).json({ error: 'Token inválido o expirado' });
    }
};

export const requerirRol = (rolesPermitidos: string[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        if (!req.usuario) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            // 🔐 Auditoría de Violación de Control de Acceso (RBAC)
            await registrarEventoAuditoria(
                req.usuario.email,
                'ACCESO_NO_AUTORIZADO_RBAC',
                `El usuario con rol [${req.usuario.rol}] intentó acceder a un endpoint restringido a [${rolesPermitidos.join(', ')}]`,
                req
            );

            res.status(403).json({ error: `Acceso denegado: Se requiere rol de [${rolesPermitidos.join(', ')}]` });
            return;
        }

        next();
    };
};
