
import { useEffect, useState } from 'react';

import {
    obtenerHistorial
} from '../../api/productoApi';

import type {
    HistorialCompra
} from '../../types/producto';

const Historial = () => {

    const [historial, setHistorial] = useState<HistorialCompra[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const cargarHistorial = async () => {

        try {
            setCargando(true);
            setError('');

            const resultado = await obtenerHistorial();

            setHistorial(resultado);

        } catch (error) {

            setError(
                error instanceof Error
                    ? error.message
                    : 'No fue posible obtener el historial'
            );

        } finally {

            setCargando(false);
        }
    };

    useEffect(() => {
        cargarHistorial();
    }, []);

    return (
        <main className="app-page">

            {/* Encabezado */}
            <header className="page-header">
                <div>
                    <span className="page-label">
                        ACTIVIDAD DE CUENTA
                    </span>

                    <h1>Historial de compras</h1>

                    <p>
                        Consulta el registro de tus compras realizadas.
                    </p>
                </div>
            </header>

            {/* Contenido */}
            <section className="history-section">

                <div className="section-heading">
                    <div>
                        <h2>Compras realizadas</h2>

                        {!cargando && !error && (
                            <p>
                                {historial.length}{' '}
                                {historial.length === 1
                                    ? 'compra registrada'
                                    : 'compras registradas'}
                            </p>
                        )}
                    </div>

                    {!cargando && !error && (
                        <span className="badge badge-info">
                            {historial.length} registros
                        </span>
                    )}
                </div>

                {/* Cargando */}
                {cargando && (
                    <div className="card loading">
                        Cargando historial...
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div
                        className="alert alert-danger"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {/* Sin compras */}
                {!cargando && !error && historial.length === 0 && (
                    <div className="card empty-state">
                        <div className="empty-state-icon">
                            📋
                        </div>

                        <h3>
                            No tienes compras registradas
                        </h3>

                        <p>
                            Cuando realices una compra,
                            aparecerá aquí.
                        </p>
                    </div>
                )}

                {/* Historial */}
                {!cargando && !error && historial.length > 0 && (
                    <div className="table-container">

                        <table className="table">

                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Total</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>

                            <tbody>

                                {historial.map((compra) => (

                                    <tr key={compra.VentaGuid}>

                                        <td>
                                            <strong className="product-name">
                                                {compra.Producto}
                                            </strong>
                                        </td>

                                        <td>
                                            <span className="badge badge-info">
                                                {compra.Cantidad}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="product-price">
                                                ${compra.TotalCobrado.toFixed(2)}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="history-date">
                                                {new Date(
                                                    compra.FechaVenta
                                                ).toLocaleString()}
                                            </span>
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

export default Historial;
