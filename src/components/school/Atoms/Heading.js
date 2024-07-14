import React from 'react'
import { Typography } from '@mui/material'

const Heading = ({ variant, gutterBottom, children }) => (
    <Typography variant={variant} gutterBottom={gutterBottom}>
        {children}
    </Typography>
)

export default Heading
