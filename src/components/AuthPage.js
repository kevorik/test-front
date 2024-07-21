import React, { useState } from 'react'
import {
    TextField,
    Button,
    Box,
    Typography,
    Link,
    IconButton,
    InputAdornment,
    Snackbar,
    Alert,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../services/api' // Импорт функций API
import { useAuth } from '../components/AuthContext'
import imgHead from '../image/IMG_3738 3.png'
import imgLow from '../image/Logo itp.svg'
import ReCAPTCHA from 'react-google-recaptcha'

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')
    const [captchaToken, setCaptchaToken] = useState(null)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [touched, setTouched] = useState({
        email: false,
        password: false,
        confirmPassword: false,
        name: false,
    })
    const { login: handleLogin } = useAuth()
    const navigate = useNavigate()

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(String(email).toLowerCase())
    }

    const handleAuth = async () => {
        if (!isLogin) {
            if (password !== confirmPassword) {
                setError('Passwords do not match')
                return
            }
            if (name.length < 2 || name.length > 20) {
                setError('Name must be between 2 and 20 characters')
                return
            }
        }

        if (password.length < 8 || password.length > 20) {
            setError('Password must be between 8 and 20 characters')
            return
        }

        if (!validateEmail(email)) {
            setError('Invalid email address')
            return
        }

        if (!captchaToken) {
            setError('Please complete the CAPTCHA')
            return
        }

        try {
            if (isLogin) {
                const response = await login(email, password)
                handleLogin(response.data.token)
                navigate('/dashboard')
            } else {
                const response = await register(email, password, name)
                setIsLogin(true) // Переключение на форму входа после успешной регистрации
                setOpenSnackbar(true) // Показ уведомления об успешной регистрации
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        }
    }

    const handleClickShowPassword = () => setShowPassword(!showPassword)
    const handleClickShowConfirmPassword = () =>
        setShowConfirmPassword(!showConfirmPassword)

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpenSnackbar(false)
    }

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token)
        setError('') // Очистка ошибки CAPTCHA при успешном заполнении
    }

    const handleBlur = (field) => () => {
        setTouched({
            ...touched,
            [field]: true,
        })
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
                                onBlur={handleBlur('name')}
                                style={{ marginBottom: '15px', height: '45px' }}
                                error={
                                    touched.name &&
                                    (name.length < 2 || name.length > 20)
                                }
                                helperText={
                                    touched.name &&
                                    (name.length < 2 || name.length > 20)
                                        ? 'Name must be between 2 and 20 characters'
                                        : ''
                                }
                            />
                        </>
                    )}
                    <Typography variant="h6">Email</Typography>
                    <TextField
                        type="email"
                        fullWidth
                        variant="outlined"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleBlur('email')}
                        style={{ height: '45px', marginBottom: '15px' }}
                        error={touched.email && !validateEmail(email)}
                        helperText={
                            touched.email && !validateEmail(email)
                                ? 'Invalid email address'
                                : ''
                        }
                    />
                    <Typography variant="h6">Password</Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={handleBlur('password')}
                        style={{ marginBottom: '15px', height: '45px' }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        error={
                            touched.password &&
                            (password.length < 8 || password.length > 20)
                        }
                        helperText={
                            touched.password &&
                            (password.length < 8 || password.length > 20)
                                ? 'Password must be between 8 and 20 characters'
                                : ''
                        }
                    />
                    {!isLogin && (
                        <>
                            <Typography variant="h6">
                                Confirm Password
                            </Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                onBlur={handleBlur('confirmPassword')}
                                style={{ marginBottom: '15px', height: '45px' }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle confirm password visibility"
                                                onClick={
                                                    handleClickShowConfirmPassword
                                                }
                                                onMouseDown={
                                                    handleMouseDownPassword
                                                }
                                                edge="end"
                                            >
                                                {showConfirmPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                error={
                                    touched.confirmPassword &&
                                    password !== confirmPassword
                                }
                                helperText={
                                    touched.confirmPassword &&
                                    password !== confirmPassword
                                        ? 'Passwords do not match'
                                        : ''
                                }
                            />
                        </>
                    )}
                    {!isLogin && (
                        <>
                            <ReCAPTCHA
                                sitekey="6LeaqhMqAAAAAOXZBjXl_JhYXKnP5yp2LGTFkgFF"
                                onChange={handleCaptchaChange}
                                style={{ marginBottom: '15px' }}
                            />
                        </>
                    )}
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
                                setTouched({
                                    email: false,
                                    password: false,
                                    confirmPassword: false,
                                    name: false,
                                })
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
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Registration successful! Please log in.
                </Alert>
            </Snackbar>
        </div>
    )
}

export default AuthPage
