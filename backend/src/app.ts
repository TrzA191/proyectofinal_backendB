import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import authRoutes from './routes/authRoutes';
import productoRoutes from './routes/productoRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Headers de seguridad
app.use(helmet());


// CORS restringido al frontend
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://localhost:5173'
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

// Documentación de la API con Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Registrar rutas de la API
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
