import React, { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../services/api' // Импорт функции logout

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem('token')
    )

    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
            localStorage.removeItem('token')
            setIsAuthenticated(false)
            navigate('/login', { replace: true }) // Очистка истории браузера
        } catch (err) {
            console.error('Error during logout:', err)
        }
    }

    const login = (token) => {
        localStorage.setItem('token', token)
        setIsAuthenticated(true)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, handleLogout, login }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
