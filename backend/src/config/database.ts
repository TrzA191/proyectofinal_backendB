import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: sql.config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '123123123',
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE || 'SistemaComercial',
    port: 1433,
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
