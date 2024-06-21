import React, { useEffect, useState } from 'react'
import {
    getTeachers,
    createTeacher,
    getSubjects,
    getSchools,
    deleteTeacher,
    updateTeacher,
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
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    TableSortLabel,
} from '@mui/material'
import PaginationComponent from './PaginationComponent'

const TeacherTable = () => {
    const [teachers, setTeachers] = useState([]) // Состояние для хранения списка учителей
    const [subjects, setSubjects] = useState([]) // Состояние для хранения списка предметов
    const [schools, setSchools] = useState([]) // Состояние для хранения списка школ
    const [showCreateTeacherForm, setShowCreateTeacherForm] = useState(false) // Состояние для отображения формы создания учителя
    const [showEditTeacherForm, setShowEditTeacherForm] = useState(false) // Состояние для отображения формы редактирования учителя
    const [showSubjectDialog, setShowSubjectDialog] = useState(false) // Состояние для отображения диалога выбора предметов
    const [selectedSubjects, setSelectedSubjects] = useState([]) // Состояние для хранения выбранных предметов
    const [newTeacher, setNewTeacher] = useState({
        first_name: '',
        last_name: '',
        middle_name: '',
        subjects: [],
        school: { id: '' },
    }) // Состояние для хранения данных нового учителя
    const [editTeacher, setEditTeacher] = useState({
        id: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        subjects: [],
        school: { id: '' },
    }) // Состояние для хранения данных редактируемого учителя

    const [sortColumn, setSortColumn] = useState(null) // Состояние для хранения колонки, по которой выполняется сортировка
    const [sortDirection, setSortDirection] = useState('asc') // Состояние для хранения направления сортировки

    const [total, setTotal] = useState(0) // Общее количество записей
    const [page, setPage] = useState(1) // Текущая страница пагинации
    const [limit] = useState(10) // Лимит записей на страницу
    const [confirmOpen, setConfirmOpen] = useState(false) // Состояние для отображения подтверждения удаления
    const [selectedTeacherId, setSelectedTeacherId] = useState(null) // Состояние для хранения ID выбранного для удаления учителя

    // Эффект для загрузки данных учителей, предметов и школ
    useEffect(() => {
        loadTeachers(page, limit)
        getSubjects().then((response) =>
            setSubjects(
                Array.isArray(response.data.subjects)
                    ? response.data.subjects
                    : []
            )
        )
        getSchools().then((response) =>
            setSchools(
                Array.isArray(response.data.schools)
                    ? response.data.schools
                    : []
            )
        )
    }, [page, limit])

    // Функция для загрузки учителей
    const loadTeachers = (page, limit) => {
        getTeachers(page, limit).then((response) => {
            setTeachers(
                Array.isArray(response.data.teachers)
                    ? response.data.teachers
                    : []
            )
            setTotal(response.data.total)
        })
    }

    // Функция для создания нового учителя
    const handleCreateTeacher = async () => {
        try {
            const response = await createTeacher({
                first_name: newTeacher.first_name,
                last_name: newTeacher.last_name,
                middle_name: newTeacher.middle_name,
                subjects: newTeacher.subjects.map((subjectId) => ({
                    id: subjectId,
                })),
                school: { id: newTeacher.school.id },
            })

            if (response.status === 201) {
                loadTeachers(page, limit)
                setShowCreateTeacherForm(false)
                setNewTeacher({
                    first_name: '',
                    last_name: '',
                    middle_name: '',
                    subjects: [],
                    school: { id: '' },
                })
            }
        } catch (error) {
            console.error('Error creating teacher:', error)
        }
    }

    // Функция для редактирования учителя
    const handleEditTeacher = (teacher) => {
        setEditTeacher({
            id: teacher.id,
            first_name: teacher.first_name,
            last_name: teacher.last_name,
            middle_name: teacher.middle_name,
            subjects: teacher.subjects.map((subject) => subject.id),
            school: { id: teacher.school.id },
        })
        setSelectedSubjects(teacher.subjects.map((subject) => subject.id))
        setShowEditTeacherForm(true)
    }

    // Функция для обновления данных учителя
    const handleUpdateTeacher = async () => {
        try {
            const updatedTeacher = {
                id: editTeacher.id,
                first_name: editTeacher.first_name,
                last_name: editTeacher.last_name,
                middle_name: editTeacher.middle_name,
                subjects: editTeacher.subjects.map((subjectId) => ({
                    id: subjectId,
                })),
                school: { id: editTeacher.school.id },
            }
            await updateTeacher(editTeacher.id, updatedTeacher)
            loadTeachers(page, limit)
            setShowEditTeacherForm(false)
            setEditTeacher({
                id: '',
                first_name: '',
                last_name: '',
                middle_name: '',
                subjects: [],
                school: { id: '' },
            })
        } catch (error) {
            console.error('Error updating teacher:', error)
        }
    }

    // Функция для открытия диалога выбора предметов
    const handleSubjectDialogOpen = (forEdit = false) => {
        setSelectedSubjects(
            forEdit ? editTeacher.subjects : newTeacher.subjects
        )
        setShowSubjectDialog(true)
    }

    const handleSubjectDialogClose = () => {
        setShowSubjectDialog(false)
    }

    // Функция для переключения выбора предмета
    const handleSubjectToggle = (subjectId) => {
        setSelectedSubjects((prevSelectedSubjects) =>
            prevSelectedSubjects.includes(subjectId)
                ? prevSelectedSubjects.filter((id) => id !== subjectId)
                : [...prevSelectedSubjects, subjectId]
        )
    }

    // Функция для подтверждения выбора предметов
    const handleSubjectDialogConfirm = () => {
        if (showEditTeacherForm) {
            setEditTeacher((prevEditTeacher) => ({
                ...prevEditTeacher,
                subjects: selectedSubjects,
            }))
        } else {
            setNewTeacher((prevNewTeacher) => ({
                ...prevNewTeacher,
                subjects: selectedSubjects,
            }))
        }
        setShowSubjectDialog(false)
    }

    // Функция для удаления учителя
    const handleDeleteTeacher = (teacherId) => {
        setSelectedTeacherId(teacherId)
        setConfirmOpen(true)
    }

    const confirmDeleteTeacher = async () => {
        try {
            await deleteTeacher(selectedTeacherId)
            loadTeachers(page, limit)
            setConfirmOpen(false)
            setSelectedTeacherId(null)
        } catch (error) {
            console.error('Error deleting teacher:', error)
        }
    }

    // Обработка изменения страницы пагинации
    const handlePageChange = (event, value) => {
        setPage(value)
    }

    // Валидация имени учителя (не должно содержать цифр)
    const validateName = (name) => {
        const regex = /^[^\d]*$/
        return regex.test(name)
    }

    // Обработка изменения полей формы создания учителя
    const handleInputChange = (e, field) => {
        const { value } = e.target
        if (validateName(value)) {
            setNewTeacher({ ...newTeacher, [field]: value })
        }
    }

    // Обработка изменения полей формы редактирования учителя
    const handleEditInputChange = (e, field) => {
        const { value } = e.target
        if (validateName(value)) {
            setEditTeacher({ ...editTeacher, [field]: value })
        }
    }

    // Сортировка учителей
    const sortTeachers = (column) => {
        const isAsc = sortColumn === column && sortDirection === 'asc'
        const sortedTeachers = [...teachers].sort((a, b) => {
            if (
                column === 'first_name' ||
                column === 'last_name' ||
                column === 'middle_name'
            ) {
                const valueA = a[column].toUpperCase()
                const valueB = b[column].toUpperCase()
                return (
                    (valueA < valueB ? -1 : valueA > valueB ? 1 : 0) *
                    (isAsc ? 1 : -1)
                )
            } else if (column === 'id') {
                return (a[column] - b[column]) * (isAsc ? 1 : -1)
            }
            return 0
        })

        setTeachers(sortedTeachers)
        setSortColumn(column)
        setSortDirection(isAsc ? 'desc' : 'asc')
    }
    console.log('schools', schools)
    console.log('subjects', subjects)
    console.log('teach', teachers)

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Teachers
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === 'first_name'}
                                    direction={
                                        sortColumn === 'first_name'
                                            ? sortDirection
                                            : 'asc'
                                    }
                                    onClick={() => sortTeachers('first_name')}
                                >
                                    First Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === 'last_name'}
                                    direction={
                                        sortColumn === 'last_name'
                                            ? sortDirection
                                            : 'asc'
                                    }
                                    onClick={() => sortTeachers('last_name')}
                                >
                                    Last Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === 'middle_name'}
                                    direction={
                                        sortColumn === 'middle_name'
                                            ? sortDirection
                                            : 'asc'
                                    }
                                    onClick={() => sortTeachers('middle_name')}
                                >
                                    Middle Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Subjects</TableCell>
                            <TableCell>School</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(teachers) &&
                            teachers.map((teacher) => (
                                <TableRow key={teacher.id}>
                                    <TableCell>{teacher.id}</TableCell>
                                    <TableCell>{teacher.first_name}</TableCell>
                                    <TableCell>{teacher.last_name}</TableCell>
                                    <TableCell>{teacher.middle_name}</TableCell>
                                    <TableCell>
                                        {teacher.subjects &&
                                        teacher.subjects.length > 0 ? (
                                            <ul>
                                                {teacher.subjects.map(
                                                    (subject) => (
                                                        <li key={subject.id}>
                                                            {subject.name}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        ) : (
                                            'N/A'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {teacher.school
                                            ? teacher.school.name
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() =>
                                                handleDeleteTeacher(teacher.id)
                                            }
                                            style={{ marginRight: '10px' }}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() =>
                                                handleEditTeacher(teacher)
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
                onPageChange={handlePageChange}
            />
            <Box mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowCreateTeacherForm(true)}
                >
                    Create Teacher
                </Button>
            </Box>
            {showCreateTeacherForm && (
                <Box mt={2}>
                    <Typography variant="h6" gutterBottom>
                        Create New Teacher
                    </Typography>
                    <TextField
                        label="First Name"
                        value={newTeacher.first_name}
                        onChange={(e) => handleInputChange(e, 'first_name')}
                        fullWidth
                        margin="normal"
                        required={true}
                        inputProps={{ maxLength: 20 }}
                    />
                    <TextField
                        label="Last Name"
                        value={newTeacher.last_name}
                        onChange={(e) => handleInputChange(e, 'last_name')}
                        fullWidth
                        margin="normal"
                        required={true}
                        inputProps={{ maxLength: 20 }}
                    />
                    <TextField
                        label="Middle Name"
                        value={newTeacher.middle_name}
                        onChange={(e) => handleInputChange(e, 'middle_name')}
                        fullWidth
                        margin="normal"
                        inputProps={{ maxLength: 20 }}
                    />
                    <Button
                        variant="outlined"
                        onClick={() => handleSubjectDialogOpen(false)}
                    >
                        Select Subjects
                    </Button>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="schoolId-label">School</InputLabel>
                        <Select
                            labelId="schoolId-label"
                            value={newTeacher.school.id}
                            onChange={(e) =>
                                setNewTeacher({
                                    ...newTeacher,
                                    school: { id: e.target.value },
                                })
                            }
                        >
                            {schools.map((school) => (
                                <MenuItem key={school.id} value={school.id}>
                                    {school.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {newTeacher.subjects.length > 0 && (
                        <Box mt={2}>
                            <Typography variant="subtitle1">
                                Selected Subjects:
                            </Typography>
                            <ul>
                                {newTeacher.subjects.map((subjectId) => {
                                    const subject = subjects.find(
                                        (subject) => subject.id === subjectId
                                    )
                                    return (
                                        <li key={subjectId}>
                                            {subject
                                                ? subject.name
                                                : 'Unknown Subject'}
                                        </li>
                                    )
                                })}
                            </ul>
                        </Box>
                    )}
                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateTeacher}
                        >
                            Save
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setShowCreateTeacherForm(false)}
                            style={{ marginLeft: '10px' }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            )}

            <Dialog
                open={showEditTeacherForm}
                onClose={() => setShowEditTeacherForm(false)}
            >
                <DialogTitle>Edit Teacher</DialogTitle>
                <DialogContent>
                    <TextField
                        label="First Name"
                        value={editTeacher.first_name}
                        onChange={(e) => handleEditInputChange(e, 'first_name')}
                        fullWidth
                        margin="normal"
                        inputProps={{ maxLength: 20 }}
                    />
                    <TextField
                        label="Last Name"
                        value={editTeacher.last_name}
                        onChange={(e) => handleEditInputChange(e, 'last_name')}
                        fullWidth
                        margin="normal"
                        inputProps={{ maxLength: 20 }}
                    />
                    <TextField
                        label="Middle Name"
                        value={editTeacher.middle_name}
                        onChange={(e) =>
                            handleEditInputChange(e, 'middle_name')
                        }
                        fullWidth
                        margin="normal"
                        inputProps={{ maxLength: 20 }}
                    />
                    <Button
                        variant="outlined"
                        onClick={() => handleSubjectDialogOpen(true)}
                    >
                        Select Subjects
                    </Button>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="schoolId-label">School</InputLabel>
                        <Select
                            labelId="schoolId-label"
                            value={editTeacher.school.id}
                            onChange={(e) =>
                                setEditTeacher({
                                    ...editTeacher,
                                    school: { id: e.target.value },
                                })
                            }
                        >
                            {schools.map((school) => (
                                <MenuItem key={school.id} value={school.id}>
                                    {school.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {editTeacher.subjects.length > 0 && (
                        <Box mt={2}>
                            <Typography variant="subtitle1">
                                Selected Subjects:
                            </Typography>
                            <ul>
                                {editTeacher.subjects.map((subjectId) => {
                                    const subject = subjects.find(
                                        (subject) => subject.id === subjectId
                                    )
                                    return (
                                        <li key={subjectId}>
                                            {subject
                                                ? subject.name
                                                : 'Unknown Subject'}
                                        </li>
                                    )
                                })}
                            </ul>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setShowEditTeacherForm(false)}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateTeacher} color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showSubjectDialog} onClose={handleSubjectDialogClose}>
                <DialogTitle>Select Subjects</DialogTitle>
                <DialogContent>
                    <List>
                        {subjects.map((subject) => (
                            <ListItem
                                key={subject.id}
                                onClick={() => handleSubjectToggle(subject.id)}
                            >
                                <Checkbox
                                    checked={selectedSubjects.includes(
                                        subject.id
                                    )}
                                />
                                <ListItemText primary={subject.name} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleSubjectDialogClose}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubjectDialogConfirm}
                        color="primary"
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this teacher?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmOpen(false)}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteTeacher} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default TeacherTable
