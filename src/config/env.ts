import dotenv from 'dotenv';

dotenv.config();

export const getRequiredEnv = (name: string): string => {
    const value = process.env[name];

    if (!value?.trim()) {
        throw new Error(`Falta la variable de entorno obligatoria: ${name}`);
    }

    return value;
};
