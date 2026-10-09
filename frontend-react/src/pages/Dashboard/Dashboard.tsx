
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const { usuario, logout } = useAuth();

    const esAdministrador =
        usuario?.rol === 'Administrador' ||
        usuario?.rol === 'Admin';

    return (
        <main className="dashboard-page">

            {/* Barra superior */}
            <header className="dashboard-header">
                <div className="dashboard-brand">
                    <div className="dashboard-logo">
                        SC
                    </div>

                    <div>
                        <h1>Sistema Comercial</h1>
                        <span>Panel de control</span>
                    </div>
                </div>

                <button
                    className="btn btn-secondary btn-small"
                    type="button"
                    onClick={logout}
                >
                    Cerrar sesión
                </button>
            </header>

            {/* Contenido */}
            <div className="dashboard-container">

                {/* Bienvenida */}
                <section className="dashboard-welcome">
                    <div>
                        <span className="dashboard-label">
                            PANEL PRINCIPAL
                        </span>

                        <h2>
                            Bienvenido, {usuario?.nombreCompleto}
                        </h2>

                        <p>
                            Desde aquí puedes acceder a las funciones
                            disponibles de tu cuenta.
                        </p>
                    </div>

                    <div className="user-role">
                        <span>Rol</span>
                        <strong>{usuario?.rol}</strong>
                    </div>
                </section>

                {/* Opciones */}
                <section className="dashboard-section">

                    <div className="section-heading">
                        <div>
                            <h2>Opciones disponibles</h2>
                            <p>
                                Selecciona una opción para continuar.
                            </p>
                        </div>
                    </div>

                    <div className="dashboard-grid">

                        {/* Productos */}
                        <Link
                            className="dashboard-card"
                            to="/productos"
                        >
                            <div className="dashboard-card-icon">
                                🛒
                            </div>

                            <div className="dashboard-card-content">
                                <h3>Productos</h3>

                                <p>
                                    Consulta los productos disponibles,
                                    precios y existencias.
                                </p>
                            </div>

                            <span className="dashboard-card-arrow">
                                →
                            </span>
                        </Link>

                        {/* Historial */}
                        <Link
                            className="dashboard-card"
                            to="/historial"
                        >
                            <div className="dashboard-card-icon">
                                📋
                            </div>

                            <div className="dashboard-card-content">
                                <h3>Historial de compras</h3>

                                <p>
                                    Consulta el historial de tus compras
                                    realizadas.
                                </p>
                            </div>

                            <span className="dashboard-card-arrow">
                                →
                            </span>
                        </Link>

                        {/* Administración */}
                        {esAdministrador && (
                            <Link
                                className="dashboard-card dashboard-card-admin"
                                to="/admin/productos"
                            >
                                <div className="dashboard-card-icon">
                                    ⚙️
                                </div>

                                <div className="dashboard-card-content">
                                    <h3>Administrar productos</h3>

                                    <p>
                                        Gestiona productos, precios y
                                        existencias del sistema.
                                    </p>
                                </div>

                                <span className="dashboard-card-arrow">
                                    →
                                </span>
                            </Link>
                        )}

                    </div>
                </section>

                {/* Información de sesión */}
                <section className="dashboard-session card">

                    <div>
                        <span className="dashboard-label">
                            SESIÓN ACTIVA
                        </span>

                        <h3>
                            {usuario?.email}
                        </h3>

                        <p>
                            Tu sesión está protegida mediante
                            autenticación JWT.
                        </p>
                    </div>

                    <span className="badge badge-success">
                        Autenticado
                    </span>

                </section>

            </div>
        </main>
    );
};

export default Dashboard;

