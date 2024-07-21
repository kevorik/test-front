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
    TableSortLabel,
    FormControlLabel,
    Checkbox,
} from '@mui/material'
import PaginationComponent from './PaginationComponent'
import { DatePicker } from '@mui/x-date-pickers'
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

const SubjectTable = () => {
    const [subjects, setSubjects] = useState([]) // Состояние для хранения списка предметов
    const [showCreateForm, setShowCreateForm] = useState(false) // Состояние для отображения формы создания предмета
    const [showEditForm, setShowEditForm] = useState(false) // Состояние для отображения формы редактирования предмета
    const [newSubject, setNewSubject] = useState({
        name: '',
        isActive: false,
        foundedDate: null,
    }) // Состояние для хранения данных нового предмета
    const [selectedSubject, setSelectedSubject] = useState(null) // Состояние для хранения выбранного для редактирования предмета
    const [error, setError] = useState('') // Состояние для хранения сообщений об ошибках
    const [confirmOpen, setConfirmOpen] = useState(false) // Состояние для отображения подтверждения удаления
    const [selectedSubjectId, setSelectedSubjectId] = useState(null) // Состояние для хранения ID выбранного для удаления предмета
    const [total, setTotal] = useState(0) // Общее количество записей
    const [page, setPage] = useState(1) // Текущая страница пагинации
    const [limit] = useState(5) // Лимит записей на страницу

    const [sortColumn, setSortColumn] = useState('id')
    const [sortDirection, setSortDirection] = useState('asc')

    useEffect(() => {
        fetchSubjects(page, limit, sortColumn, sortDirection) // Загрузка предметов при изменении страницы или лимита
    }, [page, limit, sortColumn, sortDirection])

    // Функция для получения списка предметов
    const fetchSubjects = async (page, limit, sortColumn, sortDirection) => {
        try {
            const response = await getSubjects(
                page,
                limit,
                sortColumn,
                sortDirection
            )
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
            fetchSubjects(page, limit, sortColumn, sortDirection)
            setShowCreateForm(false)
            setNewSubject({ name: '', isActive: false, foundedDate: null })
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
        const { name, value, checked, type } = e.target
        const updatedValue = type === 'checkbox' ? checked : value
        if (validateName(updatedValue) || name === 'isActive') {
            setNewSubject({ ...newSubject, [name]: updatedValue })
            setError('')
        } else {
            setError('Subject name should not contain numbers.')
        }
    }

    // Обработка изменения полей формы редактирования предмета
    const handleEditInputChange = (e) => {
        const { name, value, checked, type } = e.target
        const updatedValue = type === 'checkbox' ? checked : value
        if (validateName(updatedValue) || name === 'isActive') {
            setSelectedSubject({ ...selectedSubject, [name]: updatedValue })
            setError('')
        } else {
            setError('Subject name should not contain numbers.')
        }
    }

    const handleDateChange = (date) => {
        setNewSubject({ ...newSubject, foundedDate: date })
    }

    const handleEditDateChange = (date) => {
        setSelectedSubject({ ...selectedSubject, foundedDate: date })
    }

    // Сортировка предметов
    const handleSortRequest = (column) => {
        const isAsc = sortColumn === column && sortDirection === 'asc'
        setSortDirection(isAsc ? 'desc' : 'asc')
        setSortColumn(column)
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom></Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell
                                sortDirection={
                                    sortColumn === 'name'
                                        ? sortDirection
                                        : false
                                }
                            >
                                <TableSortLabel
                                    active={sortColumn === 'name'}
                                    direction={
                                        sortColumn === 'name'
                                            ? sortDirection
                                            : 'asc'
                                    }
                                    onClick={() => handleSortRequest('name')}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>isActive</TableCell>
                            <TableCell>Founded Date</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subjects.map((subject) => (
                            <TableRow key={subject.id}>
                                <TableCell>{subject.id}</TableCell>
                                <TableCell>{subject.name}</TableCell>
                                <TableCell>
                                    {subject.isActive ? 'Yes' : 'No'}
                                </TableCell>
                                <TableCell>
                                    {subject.foundedDate
                                        ? new Date(
                                              subject.foundedDate
                                          ).toLocaleDateString()
                                        : ''}
                                </TableCell>
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

            {/* Форма создания предмета */}
            <Dialog
                open={showCreateForm}
                onClose={() => setShowCreateForm(false)}
            >
                <DialogTitle>Create New Subject</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        name="name"
                        value={newSubject.name}
                        onChange={handleInputChange}
                        error={error && !validateName(newSubject.name)}
                        helperText={
                            error &&
                            !validateName(newSubject.name) &&
                            'Subject name should not contain numbers.'
                        }
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newSubject.isActive}
                                onChange={handleInputChange}
                                name="isActive"
                                color="primary"
                            />
                        }
                        label="isActive"
                    />

                    <DatePicker
                        label="Founded Date"
                        value={newSubject.foundedDate}
                        onChange={(date) => handleDateChange(date)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowCreateForm(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreateSubject} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showEditForm} onClose={() => setShowEditForm(false)}>
                <DialogTitle>Edit Subject</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        name="name"
                        value={selectedSubject ? selectedSubject.name : ''}
                        onChange={handleEditInputChange}
                        error={error && !validateName(selectedSubject.name)}
                        helperText={
                            error &&
                            !validateName(selectedSubject.name) &&
                            'Subject name should not contain numbers.'
                        }
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={
                                    selectedSubject
                                        ? selectedSubject.isActive
                                        : false
                                }
                                onChange={handleEditInputChange}
                                name="isActive"
                                color="primary"
                            />
                        }
                        label="isActive"
                    />

                    <DatePicker
                        label="Founded Date"
                        value={
                            selectedSubject ? selectedSubject.foundedDate : null
                        }
                        onChange={(date) => handleEditDateChange(date)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowEditForm(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateSubject} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Подтверждение удаления */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this subject?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteSubject} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default SubjectTable
