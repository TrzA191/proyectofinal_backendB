import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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
        res.status(403).json({ error: 'Token inválido o expirado' });
    }
};

export const requerirRol = (rolesPermitidos: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.usuario) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            res.status(403).json({ error: `Acceso denegado: Se requiere rol de [${rolesPermitidos.join(', ')}]` });
            return;
        }

        next();
    };
};
