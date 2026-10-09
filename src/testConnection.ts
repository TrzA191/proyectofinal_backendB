import { getDbConnection } from './config/database';

const test = async () => {
    console.log('🔄 Intentando conectar a MySQL...');
    try {
        const pool = await getDbConnection();
        
        // Ejecutamos una consulta simple para verificar la versión de MySQL
        const [rows]: any = await pool.query('SELECT VERSION() AS Version, DATABASE() AS DatabaseName');
        console.log('🎉 ¡Conexión Exitosa!');
        console.log('Base de datos conectada:', rows[0].DatabaseName);
        console.log('Versión de MySQL:', rows[0].Version);

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Falló la prueba de conexión:', error);
        process.exit(1);
    }
};

test();
