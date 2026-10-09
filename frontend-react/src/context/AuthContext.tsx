import {
    createContext,
    useContext,
    useState,
    type ReactNode
} from 'react';

import type { Usuario, LoginRequest } from '../types/auth';
import { login as loginApi } from '../api/authApi';

interface AuthContextType {
    usuario: Usuario | null;
    token: string | null;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    autenticado: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({
    children
}: AuthProviderProps) => {

    const [usuario, setUsuario] = useState<Usuario | null>(() => {
        const usuarioGuardado = sessionStorage.getItem('usuario');

        return usuarioGuardado
            ? JSON.parse(usuarioGuardado)
            : null;
    });

    const [token, setToken] = useState<string | null>(() => {
        return sessionStorage.getItem('token');
    });

    const login = async (credentials: LoginRequest) => {

        const respuesta = await loginApi(credentials);

        setToken(respuesta.token);
        setUsuario(respuesta.usuario);

        sessionStorage.setItem('token', respuesta.token);
        sessionStorage.setItem(
            'usuario',
            JSON.stringify(respuesta.usuario)
        );
    };

    const logout = () => {
        setToken(null);
        setUsuario(null);

        sessionStorage.removeItem('token');
        sessionStorage.removeItem('usuario');
    };

    return (
        <AuthContext.Provider
            value={{
                usuario,
                token,
                login,
                logout,
                autenticado: !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth debe utilizarse dentro de AuthProvider'
        );
    }

    return context;
};