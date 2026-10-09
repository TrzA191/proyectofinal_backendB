
import { useEffect, useState } from 'react';
import {
    buscarProductos,
    registrarCompra
} from '../../api/productoApi';
import type { Producto } from '../../types/producto';

const Productos = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [filtro, setFiltro] = useState('');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [comprando, setComprando] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState('');

    const cargarProductos = async (texto = '') => {
        try {
            setCargando(true);
            setError('');

            const resultado = await buscarProductos(texto);

            setProductos(resultado);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'No fue posible obtener los productos'
            );
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const handleBuscar = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setMensaje('');

        await cargarProductos(filtro);
    };

    const handleComprar = async (producto: Producto) => {
        try {
            setComprando(producto.ProductoGuid);
            setError('');
            setMensaje('');

            const resultado = await registrarCompra(
                producto.ProductoGuid,
                1
            );

            setMensaje(
                `${resultado.mensaje}. ${producto.Nombre} comprado correctamente.`
            );

            await cargarProductos(filtro);

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'No fue posible registrar la compra'
            );
        } finally {
            setComprando(null);
        }
    };

    return (
        <main className="app-page">

            {/* Encabezado */}
            <header className="page-header">
                <div>
                    <span className="page-label">
                        CATÁLOGO
                    </span>

                    <h1>Productos</h1>

                    <p>
                        Consulta los productos disponibles en el sistema.
                    </p>
                </div>
            </header>

            {/* Buscador */}
            <section className="search-card card">

                <div className="search-header">
                    <div>
                        <h2>Buscar productos</h2>

                        <p>
                            Busca por nombre o código SKU.
                        </p>
                    </div>
                </div>

                <form
                    className="search-form"
                    onSubmit={handleBuscar}
                >
                    <div className="search-input-wrapper">
                        <label
                            className="form-label"
                            htmlFor="filtro"
                        >
                            Producto
                        </label>

                        <input
                            className="form-input"
                            id="filtro"
                            type="text"
                            value={filtro}
                            onChange={(event) =>
                                setFiltro(event.target.value)
                            }
                            placeholder="Ej. Laptop, Smartphone, PROD-001..."
                        />
                    </div>

                    <button
                        className="btn btn-primary search-button"
                        type="submit"
                    >
                        Buscar
                    </button>
                </form>
            </section>

            {/* Mensajes */}
            {mensaje && (
                <div
                    className="alert alert-success page-alert"
                    role="status"
                >
                    {mensaje}
                </div>
            )}

            {error && (
                <div
                    className="alert alert-danger page-alert"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {/* Resultados */}
            <section className="products-section">

                <div className="section-heading">
                    <div>
                        <h2>Productos disponibles</h2>

                        {!cargando && !error && (
                            <p>
                                {productos.length}{' '}
                                {productos.length === 1
                                    ? 'producto encontrado'
                                    : 'productos encontrados'}
                            </p>
                        )}
                    </div>

                    {!cargando && !error && (
                        <span className="badge badge-info">
                            {productos.length} resultados
                        </span>
                    )}
                </div>

                {cargando && (
                    <div className="card loading">
                        Cargando productos...
                    </div>
                )}

                {!cargando && !error && productos.length === 0 && (
                    <div className="card empty-state">
                        <div className="empty-state-icon">
                            🔎
                        </div>

                        <h3>
                            No se encontraron productos
                        </h3>

                        <p>
                            Intenta realizar una búsqueda diferente.
                        </p>
                    </div>
                )}

                {!cargando && !error && productos.length > 0 && (
                    <div className="table-container">

                        <table className="table">

                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>

                            <tbody>
                                {productos.map((producto) => (
                                    <tr
                                        key={producto.ProductoGuid}
                                    >
                                        <td>
                                            <span className="product-sku">
                                                {producto.CodigoSKU}
                                            </span>
                                        </td>

                                        <td>
                                            <strong className="product-name">
                                                {producto.Nombre}
                                            </strong>
                                        </td>

                                        <td>
                                            <span className="product-price">
                                                ${producto.Precio.toFixed(2)}
                                            </span>
                                        </td>

                                        <td>
                                            {producto.Stock > 0 ? (
                                                <span className="badge badge-success">
                                                    {producto.Stock} disponibles
                                                </span>
                                            ) : (
                                                <span className="badge badge-danger">
                                                    Sin stock
                                                </span>
                                            )}
                                        </td>

                                        <td>
                                            <button
                                                className="btn btn-primary btn-small"
                                                type="button"
                                                disabled={
                                                    producto.Stock <= 0 ||
                                                    comprando ===
                                                        producto.ProductoGuid
                                                }
                                                onClick={() =>
                                                    handleComprar(
                                                        producto
                                                    )
                                                }
                                            >
                                                {comprando ===
                                                producto.ProductoGuid
                                                    ? 'Comprando...'
                                                    : producto.Stock <= 0
                                                    ? 'Sin stock'
                                                    : 'Comprar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}

            </section>

        </main>
    );
};

export default Productos;

