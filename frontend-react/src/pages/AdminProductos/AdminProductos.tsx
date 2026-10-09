
import { useState } from 'react';

import { crearProducto } from '../../api/productoApi';

const AdminProductos = () => {
    const [codigoSKU, setCodigoSKU] = useState('');
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');

    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [guardando, setGuardando] = useState(false);

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setMensaje('');
        setError('');

        try {
            setGuardando(true);

            const resultado = await crearProducto(
                codigoSKU,
                nombre,
                Number(precio),
                Number(stock)
            );

            setMensaje(resultado.mensaje);

            setCodigoSKU('');
            setNombre('');
            setPrecio('');
            setStock('');
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'No fue posible crear el producto'
            );
        } finally {
            setGuardando(false);
        }
    };

    return (
        <main className="app-page">

            {/* Encabezado */}
            <header className="page-header">
                <div>
                    <span className="page-label">
                        ADMINISTRACIÓN
                    </span>

                    <h1>Administrar productos</h1>

                    <p>
                        Registra nuevos productos en el sistema.
                    </p>
                </div>
            </header>

            <section className="admin-section">

                {/* Mensajes */}
                {mensaje && (
                    <div
                        className="alert alert-success"
                        role="status"
                    >
                        {mensaje}
                    </div>
                )}

                {error && (
                    <div
                        className="alert alert-danger"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {/* Formulario */}
                <div className="card admin-card">

                    <div className="admin-card-header">
                        <div>
                            <h2>Nuevo producto</h2>

                            <p>
                                Completa los datos para registrar
                                un nuevo producto.
                            </p>
                        </div>

                        <span className="badge badge-info">
                            Administrador
                        </span>
                    </div>

                    <form
                        className="admin-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="admin-form-grid">

                            <div className="form-group">
                                <label
                                    className="form-label"
                                    htmlFor="codigoSKU"
                                >
                                    Código SKU
                                </label>

                                <input
                                    className="form-input"
                                    id="codigoSKU"
                                    type="text"
                                    value={codigoSKU}
                                    onChange={(event) =>
                                        setCodigoSKU(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Ej. PROD-001"
                                    required
                                />

                                <span className="form-help">
                                    Código único del producto.
                                </span>
                            </div>

                            <div className="form-group">
                                <label
                                    className="form-label"
                                    htmlFor="nombre"
                                >
                                    Nombre
                                </label>

                                <input
                                    className="form-input"
                                    id="nombre"
                                    type="text"
                                    value={nombre}
                                    onChange={(event) =>
                                        setNombre(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Nombre del producto"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label
                                    className="form-label"
                                    htmlFor="precio"
                                >
                                    Precio
                                </label>

                                <div className="input-prefix">
                                    <span>$</span>

                                    <input
                                        className="form-input"
                                        id="precio"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={precio}
                                        onChange={(event) =>
                                            setPrecio(
                                                event.target.value
                                            )
                                        }
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label
                                    className="form-label"
                                    htmlFor="stock"
                                >
                                    Stock inicial
                                </label>

                                <input
                                    className="form-input"
                                    id="stock"
                                    type="number"
                                    min="0"
                                    value={stock}
                                    onChange={(event) =>
                                        setStock(
                                            event.target.value
                                        )
                                    }
                                    placeholder="0"
                                    required
                                />
                            </div>

                        </div>

                        <div className="admin-form-footer">
                            <p>
                                Los datos serán registrados
                                mediante el sistema de administración.
                            </p>

                            <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={guardando}
                            >
                                {guardando
                                    ? 'Guardando...'
                                    : 'Crear producto'}
                            </button>
                        </div>

                    </form>
                </div>

                {/* Información de seguridad */}
                <div className="admin-security card">

                    <div className="admin-security-icon">
                        ✓
                    </div>

                    <div>
                        <h3>Acceso administrativo</h3>

                        <p>
                            Esta función está disponible únicamente
                            para usuarios con rol de Administrador.
                            Las solicitudes son validadas por el backend
                            mediante autenticación y autorización.
                        </p>
                    </div>

                </div>

            </section>

        </main>
    );
};

export default AdminProductos;

