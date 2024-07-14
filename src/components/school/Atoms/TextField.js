import React from 'react'
import { TextField as MuiTextField } from '@mui/material'

const TextField = ({
    label,
    value,
    onChange,
    fullWidth,
    margin,
    required,
    inputProps,
    error,
    helperText,
}) => (
    <MuiTextField
        label={label}
        value={value}
        onChange={onChange}
        fullWidth={fullWidth}
        margin={margin}
        required={required}
        inputProps={inputProps}
        error={error}
        helperText={helperText}
    />
)

export default TextField
