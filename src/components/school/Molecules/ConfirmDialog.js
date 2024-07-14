import React from 'react'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material'
import Button from '../Atoms/Button'

const ConfirmDialog = ({ open, onClose, onConfirm, title, content }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">
                Cancel
            </Button>
            <Button onClick={onConfirm} color="secondary">
                Delete
            </Button>
        </DialogActions>
    </Dialog>
)

export default ConfirmDialog
