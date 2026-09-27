import { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../services/jwtService';

export interface AuthenticatedRequest extends Request {
    usuario?: {
        usuarioGuid: string;
        email: string;
        rol: string;
    };
}

export function autenticar(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        res.status(401).json({
            error: 'Autenticación requerida'
        });
        return;
    }

    const token = authorization.substring(7);

    try {
        const payload = verificarToken(token);

        req.usuario = {
            usuarioGuid: payload.usuarioGuid,
            email: payload.email,
            rol: payload.rol
        };

        next();
    } catch {
        res.status(401).json({
            error: 'Token inválido o expirado'
        });
    }
}

export function autorizarRoles(...rolesPermitidos: string[]) {
    return (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): void => {

        if (!req.usuario) {
            res.status(401).json({
                error: 'Autenticación requerida'
            });
            return;
        }

        const tienePermiso = rolesPermitidos.some(
            rol =>
                rol.toLowerCase() ===
                req.usuario!.rol.toLowerCase()
        );

        if (!tienePermiso) {
            res.status(403).json({
                error: 'No tienes permisos para realizar esta operación'
            });
            return;
        }

        next();
    };
}