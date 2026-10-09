import mysql, { Pool } from 'mysql2/promise';
import { getRequiredEnv } from './env';

const dbConfig = {
    user: getRequiredEnv('DB_USER'),
    password: getRequiredEnv('DB_PASSWORD'),
    host: getRequiredEnv('DB_SERVER'), // Utiliza host para MySQL en lugar de server
    database: getRequiredEnv('DB_DATABASE'),
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool: Pool | null = null;

export const getDbConnection = async (): Promise<Pool> => {
    try {
        if (!pool) {
            pool = mysql.createPool(dbConfig);
            // Verificar la conexión
            await pool.query('SELECT 1');
            console.log('✅ Conexión exitosa a la base de datos MySQL');
        }
        return pool;
    } catch (error) {
        console.error('❌ Error al conectar a MySQL:', error);
        throw error;
    }
};
