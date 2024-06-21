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
import PaginationComponent from './PaginationComponent'

const SubjectTable = () => {
    const [subjects, setSubjects] = useState([]) // Состояние для хранения списка предметов
    const [showCreateForm, setShowCreateForm] = useState(false) // Состояние для отображения формы создания предмета
    const [showEditForm, setShowEditForm] = useState(false) // Состояние для отображения формы редактирования предмета
    const [newSubject, setNewSubject] = useState({ name: '' }) // Состояние для хранения данных нового предмета
    const [selectedSubject, setSelectedSubject] = useState(null) // Состояние для хранения выбранного для редактирования предмета
    const [error, setError] = useState('') // Состояние для хранения сообщений об ошибках
    const [confirmOpen, setConfirmOpen] = useState(false) // Состояние для отображения подтверждения удаления
    const [selectedSubjectId, setSelectedSubjectId] = useState(null) // Состояние для хранения ID выбранного для удаления предмета
    const [total, setTotal] = useState(0) // Общее количество записей
    const [page, setPage] = useState(1) // Текущая страница пагинации
    const [limit] = useState(10) // Лимит записей на страницу

    useEffect(() => {
        fetchSubjects(page, limit) // Загрузка предметов при изменении страницы или лимита
    }, [page])

    // Функция для получения списка предметов
    const fetchSubjects = async () => {
        try {
            const response = await getSubjects(page, limit)
            const { subjects, total } = response.data
            setSubjects(subjects || [])
            setTotal(total || 0)
        } catch (error) {
            console.error('Error fetching subjects:', error)
        }
    }

    // Функция для создания нового предмета
    const handleCreateSubject = async () => {
        if (!validateName(newSubject.name)) {
            setError('Subject name should not contain numbers.')
            return
        }

        if (subjects.some((subject) => subject.name === newSubject.name)) {
            setError('Subject with this name already exists.')
            return
        }

        try {
            await createSubject(newSubject)
            fetchSubjects(page, limit)
            setShowCreateForm(false)
            setNewSubject({ name: '' })
            setError('')
        } catch (error) {
            setError('Error creating subject.')
            console.error('Error creating subject:', error)
        }
    }

    // Функция для редактирования предмета
    const handleEditSubject = (subject) => {
        setSelectedSubject(subject)
        setShowEditForm(true)
    }

    // Функция для обновления данных предмета
    const handleUpdateSubject = async () => {
        if (!validateName(selectedSubject.name)) {
            setError('Subject name should not contain numbers.')
            return
        }

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

    // Функция для удаления предмета
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

    // Обработка изменения страницы пагинации
    const handleChangePage = (event, value) => {
        setPage(value)
    }

    // Валидация имени предмета (не должно содержать цифр)
    const validateName = (name) => {
        const regex = /^\D*$/
        return regex.test(name)
    }

    // Обработка изменения полей формы создания предмета
    const handleInputChange = (e) => {
        const { value } = e.target
        if (validateName(value)) {
            setNewSubject({ ...newSubject, name: value })
            setError('')
        } else {
            setError('Subject name should not contain numbers.')
        }
    }

    // Обработка изменения полей формы редактирования предмета
    const handleEditInputChange = (e) => {
        const { value } = e.target
        if (validateName(value)) {
            setSelectedSubject({ ...selectedSubject, name: value })
            setError('')
        } else {
            setError('Subject name should not contain numbers.')
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
            <PaginationComponent
                totalItems={total}
                itemsPerPage={limit}
                currentPage={page}
                onPageChange={handleChangePage}
            />
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
                        onChange={handleInputChange}
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
                            onChange={handleEditInputChange}
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
