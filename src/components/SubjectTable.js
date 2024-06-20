import React, { useEffect, useState } from 'react'
import {
    getSubjects,
    createSubject,
    deleteSubject,
    updateSubject,
} from '../services/api'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    TextField,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material'

const SubjectTable = () => {
    const [subjects, setSubjects] = useState([])
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [newSubject, setNewSubject] = useState({ name: '' })
    const [selectedSubject, setSelectedSubject] = useState(null)
    const [error, setError] = useState('')
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedSubjectId, setSelectedSubjectId] = useState(null)

    useEffect(() => {
        fetchSubjects()
    }, [])

    const fetchSubjects = async () => {
        try {
            const response = await getSubjects()
            setSubjects(response.data)
        } catch (error) {
            console.error('Error fetching subjects:', error)
        }
    }

    const handleCreateSubject = async () => {
        if (subjects.some((subject) => subject.name === newSubject.name)) {
            setError('Subject with this name already exists.')
            return
        }

        try {
            await createSubject(newSubject)
            fetchSubjects()
            setShowCreateForm(false)
            setNewSubject({ name: '' })
            setError('')
        } catch (error) {
            setError('Error creating subject.')
            console.error('Error creating subject:', error)
        }
    }

    const handleEditSubject = (subject) => {
        setSelectedSubject(subject)
        setShowEditForm(true)
    }

    const handleUpdateSubject = async () => {
        if (
            subjects.some(
                (subject) =>
                    subject.name === selectedSubject.name &&
                    subject.id !== selectedSubject.id
            )
        ) {
            setError('Subject with this name already exists.')
            return
        }

        try {
            await updateSubject(selectedSubject.id, selectedSubject)
            fetchSubjects()
            setShowEditForm(false)
            setSelectedSubject(null)
            setError('')
        } catch (error) {
            setError('Error updating subject.')
            console.error('Error updating subject:', error)
        }
    }

    const handleDeleteSubject = (subjectId) => {
        setSelectedSubjectId(subjectId)
        setConfirmOpen(true)
    }

    const confirmDeleteSubject = async () => {
        try {
            await deleteSubject(selectedSubjectId)
            setSubjects((prevSubjects) =>
                prevSubjects.filter(
                    (subject) => subject.id !== selectedSubjectId
                )
            )
            setConfirmOpen(false)
            setSelectedSubjectId(null)
        } catch (error) {
            console.error('Error deleting subject:', error)
        }
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Subjects
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subjects.map((subject) => (
                            <TableRow key={subject.id}>
                                <TableCell>{subject.id}</TableCell>
                                <TableCell>{subject.name}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() =>
                                            handleDeleteSubject(subject.id)
                                        }
                                        style={{ marginRight: '10px' }}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                            handleEditSubject(subject)
                                        }
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowCreateForm(true)}
                >
                    Create Subject
                </Button>
            </Box>
            {showCreateForm && (
                <Box mt={2}>
                    <Typography variant="h6" gutterBottom>
                        Create New Subject
                    </Typography>
                    <TextField
                        label="Name"
                        value={newSubject.name}
                        onChange={(e) =>
                            setNewSubject({
                                ...newSubject,
                                name: e.target.value,
                            })
                        }
                        fullWidth
                        margin="normal"
                        required={true}
                        inputProps={{ maxLength: 30 }}
                        error={!!error}
                        helperText={error}
                    />
                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateSubject}
                        >
                            Save
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setShowCreateForm(false)}
                            style={{ marginLeft: '10px' }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            )}

            {showEditForm && selectedSubject && (
                <Dialog
                    open={showEditForm}
                    onClose={() => setShowEditForm(false)}
                >
                    <DialogTitle>Edit Subject</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Name"
                            value={selectedSubject.name}
                            onChange={(e) =>
                                setSelectedSubject({
                                    ...selectedSubject,
                                    name: e.target.value,
                                })
                            }
                            fullWidth
                            margin="normal"
                            required={true}
                            inputProps={{ maxLength: 30 }}
                            error={!!error}
                            helperText={error}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setShowEditForm(false)}
                            color="secondary"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateSubject} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this subject?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmOpen(false)}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteSubject} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default SubjectTable
