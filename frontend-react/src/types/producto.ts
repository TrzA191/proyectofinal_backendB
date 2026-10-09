export interface Producto {
    ProductoGuid: string;
    CodigoSKU: string;
    Nombre: string;
    Precio: number;
    Stock: number;
}

export interface HistorialCompra {
    VentaGuid: string;
    Producto: string;
    Cantidad: number;
    TotalCobrado: number;
    FechaVenta: string;
}