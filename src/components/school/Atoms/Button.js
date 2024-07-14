import React from 'react'
import { Button as MuiButton } from '@mui/material'

const Button = ({ variant, color, onClick, children, style }) => (
    <MuiButton variant={variant} color={color} onClick={onClick} style={style}>
        {children}
    </MuiButton>
)

export default Button
