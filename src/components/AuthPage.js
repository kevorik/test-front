import React, { useState } from 'react'
import { TextField, Button, Box, Typography, Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../services/api' // Импорт функций API
import { useAuth } from '../components/AuthContext'
import imgHead from '../image/IMG_3738 3.png'
import imgLow from '../image/Logo itp.svg'

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const { login: handleLogin } = useAuth()
    const navigate = useNavigate()

    const handleAuth = async () => {
        try {
            if (isLogin) {
                const response = await login(email, password)
                handleLogin(response.data.token)
                navigate('/dashboard') // Перенаправление после успешного входа
            } else {
                const response = await register(email, password, name)
                setIsLogin(true) // Переключение на форму входа после успешной регистрации
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        }
    }

    return (
        <div style={{ display: 'flex' }}>
            <div
                style={{
                    width: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '100vh',
                }}
            >
                <div style={{ width: '45%' }}>
                    <Typography variant="h3" gutterBottom>
                        {isLogin ? 'Log in' : 'Sign up'}
                    </Typography>
                    <Typography
                        variant="body1"
                        color="textSecondary"
                        gutterBottom
                    >
                        {isLogin
                            ? 'Welcome Back! Please enter your details.'
                            : 'Create an account to get started.'}
                    </Typography>
                    {!isLogin && (
                        <>
                            <Typography variant="h6">Name</Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ marginBottom: '15px', height: '45px' }}
                            />
                        </>
                    )}
                    <Typography variant="h6">Email</Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ height: '45px', marginBottom: '15px' }}
                    />
                    <Typography variant="h6">Password</Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ marginBottom: '30px', height: '45px' }}
                    />
                    {error && (
                        <Typography variant="body2" color="error" gutterBottom>
                            {error}
                        </Typography>
                    )}
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleAuth}
                        style={{ marginBottom: '15px', height: '45px' }}
                    >
                        {isLogin ? 'Sign in' : 'Sign up'}
                    </Button>
                    <span style={{ display: 'flex', justifyContent: 'center' }}>
                        {isLogin
                            ? "Don't have an account?"
                            : 'Already have an account?'}
                        <Link
                            onClick={() => {
                                setIsLogin(!isLogin)
                                setError('')
                            }}
                            style={{ paddingLeft: '10px', cursor: 'pointer' }}
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </Link>
                    </span>
                </div>
            </div>
            <div>
                <img
                    src={imgHead}
                    style={{ width: '700px' }}
                    alt="Auth Image Head"
                />
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                        src={imgLow}
                        style={{ width: '500px' }}
                        alt="Auth Image Low"
                    />
                </Box>
            </div>
        </div>
    )
}

export default AuthPage
