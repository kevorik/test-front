import React from 'react'
import TextField from '../Atoms/TextField'

const FormField = ({
    label,
    value,
    onChange,
    error,
    helperText,
    maxLength,
}) => (
    <TextField
        label={label}
        value={value}
        onChange={onChange}
        fullWidth
        margin="normal"
        required
        inputProps={{ maxLength }}
        error={!!error}
        helperText={helperText}
    />
)

export default FormField
