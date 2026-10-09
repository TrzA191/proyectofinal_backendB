import type {
    Producto,
    HistorialCompra
} from '../types/producto';

const API_URL = import.meta.env.VITE_API_URL;

const obtenerToken = (): string => {
    const token = sessionStorage.getItem('token');

    if (!token) {
        throw new Error('Sesión no válida');
    }

    return token;
};

export const buscarProductos = async (
    filtro: string = ''
): Promise<Producto[]> => {

    const token = obtenerToken();

    const response = await fetch(
        `${API_URL}/productos/buscar?filtro=${encodeURIComponent(filtro)}`,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || 'Error al buscar productos'
        );
    }

    return data.productos;
};

export const obtenerHistorial = async (): Promise<HistorialCompra[]> => {

    const token = obtenerToken();

    const response = await fetch(
        `${API_URL}/productos/historial`,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || 'Error al obtener historial'
        );
    }

    return data.historial;
};

export const registrarCompra = async (
    productoGuid: string,
    cantidad: number
) => {

    const token = obtenerToken();

    const response = await fetch(
        `${API_URL}/productos/comprar`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                productoGuid,
                cantidad
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || 'Error al registrar la compra'
        );
    }

    return data;
};

export const crearProducto = async (
    codigoSKU: string,
    nombre: string,
    precio: number,
    stock: number
) => {

    const token = obtenerToken();

    const response = await fetch(
        `${API_URL}/productos/crear`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                codigoSKU,
                nombre,
                precio,
                stock
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || 'Error al crear producto'
        );
    }

    return data;
};