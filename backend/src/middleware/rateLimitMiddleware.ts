import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Demasiados intentos. Intenta nuevamente más tarde.'
    }
});

export const searchRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Demasiadas solicitudes. Intenta nuevamente más tarde.'
    }
});