import express from 'express';
import cors from 'cors';
import './config/env';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import authRoutes from './routes/authRoutes';
import productoRoutes from './routes/productoRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales básicos
// 🔐 CORS Restringido (Solo permite que tu Frontend en el puerto 5173 consuma la API)
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Documentación de la API con Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Registrar Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API Sistema Comercial funcionando (Fase 0 Vulnerable)',
        swagger: `http://localhost:${PORT}/api-docs`
    });
});

// Iniciar servidor HTTP
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`📚 Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});

export default app;
