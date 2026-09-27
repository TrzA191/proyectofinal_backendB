
import jwt from 'jsonwebtoken';

export interface JwtPayload {
    usuarioGuid: string;
    email: string;
    rol: string;
}

const JWT_SECRET: string = process.env.JWT_SECRET || '';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está configurado');
}

export function generarToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: 900
    });
}

export function verificarToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
}