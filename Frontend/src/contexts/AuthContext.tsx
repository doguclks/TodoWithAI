import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    email: string;
    userName: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, email: string, userName: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedEmail = localStorage.getItem('email');
        const storedUserName = localStorage.getItem('userName');

        if (storedToken && storedEmail && storedUserName) {
            setToken(storedToken);
            setUser({ email: storedEmail, userName: storedUserName });
        }
    }, []);

    const login = (newToken: string, email: string, userName: string) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('email', email);
        localStorage.setItem('userName', userName);
        setToken(newToken);
        setUser({ email, userName });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('userName');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
