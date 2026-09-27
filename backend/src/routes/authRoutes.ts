import { Router } from 'express';
import { login } from '../controllers/authController';
import { loginRateLimiter } from '../middleware/rateLimitMiddleware';

const router = Router();

router.post(
    '/login',
    loginRateLimiter,
    login
);

export default router;
