import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Sistema Comercial',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor Local HTTP'
            },
            {
                url: 'https://localhost:3001',
                description: 'Servidor Local HTTPS Seguro'
            }
        ],
    },
    apis: ['./src/routes/*.ts'], // Archivos donde están las anotaciones OpenAPI
};

export const swaggerSpec = swaggerJSDoc(options);
