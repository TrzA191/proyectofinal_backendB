
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError('');
        setCargando(true);

        try {
            await login({
                email,
                password
            });

            navigate('/dashboard');
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'No fue posible iniciar sesión'
            );
        } finally {
            setCargando(false);
        }
    };

    return (
        <main className="login-page">
            <section className="login-card">

                <div className="login-header">
                    <div className="login-logo">
                        SC
                    </div>

                    <h1>Sistema Comercial</h1>

                    <p>
                        Inicia sesión para continuar
                    </p>
                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label
                            className="form-label"
                            htmlFor="email"
                        >
                            Correo electrónico
                        </label>

                        <input
                            className="form-input"
                            id="email"
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label
                            className="form-label"
                            htmlFor="password"
                        >
                            Contraseña
                        </label>

                        <input
                            className="form-input"
                            id="password"
                            type="password"
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />
                    </div>

                    {error && (
                        <div
                            className="alert alert-danger"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <button
                        className="btn btn-primary login-button"
                        type="submit"
                        disabled={cargando}
                    >
                        {cargando
                            ? 'Iniciando sesión...'
                            : 'Iniciar sesión'}
                    </button>
                </form>

                <div className="login-footer">
                    <span>
                        Sistema Comercial
                    </span>
                </div>

            </section>
        </main>
    );
};

export default Login;
