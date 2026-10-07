import sql from 'mssql';
import { getRequiredEnv } from './env';

const dbConfig: sql.config = {
    user: getRequiredEnv('DB_USER'),
    password: getRequiredEnv('DB_PASSWORD'),
    server: getRequiredEnv('DB_SERVER'),
    database: getRequiredEnv('DB_DATABASE'),
    port: Number(process.env.DB_PORT || 1433),
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

export const getDbConnection = async (): Promise<sql.ConnectionPool> => {
    try {
        const pool = await sql.connect(dbConfig);
        console.log('✅ Conexión exitosa a la base de datos SQL Server');
        return pool;
    } catch (error) {
        console.error('❌ Error al conectar a SQL Server:', error);
        throw error;
    }
};
