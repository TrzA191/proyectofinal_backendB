// Entidad Rol
export interface Rol {
    rolId: number;
    nombre: string;
    activo: boolean;
}

// Entidad Usuario (Mapea la tabla Seguridad.Usuarios)
export interface Usuario {
    usuarioId?: number;
    usuarioGuid: string; // GUID impredecible
    nombreCompleto: string;
    email: string;
    password?: string;  // FASE 0: Texto plano
    rolId?: number;
    rol?: string;
    fechaRegistro?: Date;
    activo?: boolean;
}

// Entidad Producto (Mapea la tabla Comercial.Productos)
export interface Producto {
    productoId?: number;
    productoGuid: string;
    codigoSKU: string;
    nombre: string;
    precio: number;
    stock: number;
}

// Entidad Venta (Mapea la tabla Comercial.Ventas)
export interface Venta {
    ventaId?: number;
    ventaGuid: string;
    producto: string;
    cantidad: number;
    totalCobrado: number;
    fechaVenta: Date;
}

// Entidad AuditLog (Mapea la tabla Seguridad.AuditLog)
export interface AuditLog {
    logId?: number;
    emailUsuario?: string;
    accion: string;
    detalle?: string;
    ip?: string;
    fechaHora?: Date;
}
