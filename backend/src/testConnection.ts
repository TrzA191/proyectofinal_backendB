import { getDbConnection } from './config/database';

const test = async () => {
    console.log('🔄 Intentando conectar a SQL Server...');
    try {
        const pool = await getDbConnection();
        
        // Ejecutamos una consulta simple para verificar la versión de SQL Server
        const result = await pool.request().query('SELECT @@VERSION AS Version, DB_NAME() AS DatabaseName');
        console.log('🎉 ¡Conexión Exitosa!');
        console.log('Base de datos conectada:', result.recordset[0].DatabaseName);
        console.log('Versión de SQL Server:', result.recordset[0].Version.split('\n')[0]);

        await pool.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Falló la prueba de conexión:', error);
        process.exit(1);
    }
};

test();
