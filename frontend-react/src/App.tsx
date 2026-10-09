import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from 'react-router-dom';

import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Productos from './pages/Productos/Productos';
import Historial from './pages/Historial/Historial';
import AdminProductos from './pages/AdminProductos/AdminProductos';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const App = () => {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/productos"
                    element={
                        <ProtectedRoute>
                            <Productos />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/historial"
                    element={
                        <ProtectedRoute>
                            <Historial />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/productos"
                    element={
                        <ProtectedRoute>
                            <AdminProductos />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
};

export default App;