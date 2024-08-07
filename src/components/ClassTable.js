import React, { useEffect, useState } from 'react'
import {
    getClasses,
    createClass,
    getTeachers,
    getStudents,
    getSchools,
    deleteClass,
    updateClass,
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
    Modal,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Checkbox,
    ListItemText,
} from '@mui/material'
import PaginationComponent from './PaginationComponent'

const ClassTable = () => {
    const [classes, setClasses] = useState([]) // Состояние для хранения списка классов
    const [teachers, setTeachers] = useState([]) // Состояние для хранения списка учителей
    const [students, setStudents] = useState([]) // Состояние для хранения списка студентов
    const [schools, setSchools] = useState([]) // Состояние для хранения списка школ
    const [showCreateForm, setShowCreateForm] = useState(false) // Состояние для отображения формы создания
    const [showEditModal, setShowEditModal] = useState(false) // Состояние для отображения модального окна редактирования
    const [editClassData, setEditClassData] = useState({
        id: '',
        name: '',
        schoolId: '',
        classTeacherId: '',
        classPrefectId: '',
    }) // Состояние для хранения данных редактируемого класса

    const [newClass, setNewClass] = useState({
        name: '',
        schoolId: '',
        classTeacherId: '',
        classPrefectId: '',
    }) // Состояние для хранения данных нового класса

    const [newClassErrors, setNewClassErrors] = useState({
        name: '',
    })

    const [editClassErrors, setEditClassErrors] = useState({
        name: '',
    })

    const [confirmOpen, setConfirmOpen] = useState(false) // Состояние для отображения подтверждения удаления
    const [selectedClassId, setSelectedClassId] = useState(null) // Состояние для хранения ID выбранного для удаления класса

    // Состояние пагинации
    const [page, setPage] = useState(1) // Текущая страница
    const [limit] = useState(5) // Лимит записей на страницу
    const [total, setTotal] = useState(0) // Общее количество записей
    const [selectedStudents, setSelectedStudents] = useState([]) // для создания класса
    const [editSelectedStudents, setEditSelectedStudents] = useState([])

    useEffect(() => {
        fetchClasses(page, limit)
        fetchTeachers()
        fetchStudents()
        fetchSchools()
    }, [page]) // Загрузка данных при изменении страницы или лимита

    // Функция для получения списка классов
    const fetchClasses = async () => {
        try {
            const response = await getClasses(page, limit)
            const { classes, total } = response.data
            setClasses(classes || [])
            setTotal(total || 0)
        } catch (error) {
            console.error('Error fetching classes:', error)
        }
    }

    // Функция для получения списка учителей
    const fetchTeachers = async () => {
        try {
            const response = await getTeachers()
            setTeachers(response.data)
        } catch (error) {
            console.error('Error fetching teachers:', error)
        }
    }

    // Функция для получения списка студентов
    const fetchStudents = async () => {
        try {
            const response = await getStudents()
            setStudents(response.data)
        } catch (error) {
            console.error('Error fetching students:', error)
        }
    }

    // Функция для получения списка школ
    const fetchSchools = async () => {
        try {
            const response = await getSchools()
            const { schools } = response.data
            setSchools(schools || [])
        } catch (error) {
            console.error('Error fetching schools:', error)
            setSchools([]) // Устанавливаем пустой массив в случае ошибки
        }
    }

    // Функция для создания нового класса
    const handleCreateClass = async () => {
        const errors = {}
        if (newClass.name.trim() === '') errors.name = 'Name is required'
        setNewClassErrors(errors)

        if (Object.keys(errors).length > 0) return
        try {
            await createClass({
                name: newClass.name,
                schoolId: newClass.schoolId,
                classTeacherId: newClass.classTeacherId,
                classPrefectId: newClass.classPrefectId,
                studentIds: selectedStudents,
            })
            fetchClasses(page, limit)
            setShowCreateForm(false)
            setNewClass({
                name: '',
                schoolId: '',
                classTeacherId: '',
                classPrefectId: '',
            })
            setSelectedStudents([])
        } catch (error) {
            console.error('Error creating class:', error)
        }
    }

    // Функция для удаления класса
    const handleDeleteClass = (classId) => {
        setSelectedClassId(classId)
        setConfirmOpen(true)
    }

    const confirmDeleteClass = async () => {
        try {
            await deleteClass(selectedClassId)
            fetchClasses(page, limit)
            setConfirmOpen(false)
            setSelectedClassId(null)
        } catch (error) {
            console.error('Error deleting class:', error)
        }
    }

    // Функция для обновления данных класса
    const handleEditClass = async () => {
        const errors = {}
        if (editClassData.name.trim() === '') errors.name = 'Name is required'
        setEditClassErrors(errors)

        if (Object.keys(errors).length > 0) return
        try {
            await updateClass(editClassData.id, {
                name: editClassData.name,
                schoolId: editClassData.schoolId,
                classTeacherId: editClassData.classTeacherId,
                classPrefectId: editClassData.classPrefectId,
                studentIds: editSelectedStudents,
            })
            fetchClasses(page, limit)
            setShowEditModal(false)
        } catch (error) {
            console.error('Error updating class:', error)
        }
    }

    // Функция для обработки изменения полей формы
    const handleChange = (event) => {
        const { name, value } = event.target

        setEditClassData({
            ...editClassData,
            [name]: value,
        })
    }

    // Открытие модального окна редактирования класса
    const openEditModal = (classItem) => {
        setEditClassData({
            id: classItem.id,
            name: classItem.name,
            schoolId: classItem.school.id,
            classTeacherId: classItem.classTeacher.id,
            classPrefectId: classItem.classPrefect.id,
        })
        setEditSelectedStudents(classItem.students.map((student) => student.id)) // устанавливаем выбранных студентов
        setShowEditModal(true)
    }

    // Обработка изменения страницы пагинации
    const handleChangePage = (event, value) => {
        setPage(value)
    }

    const handleNewClassChange = (e, field) => {
        setNewClass({ ...newClass, [field]: e.target.value })
        if (e.target.value.trim() !== '') {
            setNewClassErrors({ ...newClassErrors, [field]: '' })
        }
    }

    const handleEditClassChange = (e, field) => {
        setEditClassData({ ...editClassData, [field]: e.target.value })
        if (e.target.value.trim() !== '') {
            setEditClassErrors({ ...editClassErrors, [field]: '' })
        }
    }

    const handleStudentsChange = (event) => {
        setSelectedStudents(event.target.value)
    }

    const handleEditStudentsChange = (event) => {
        setEditSelectedStudents(event.target.value)
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom></Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>School ID</TableCell>
                            <TableCell>Class Teacher ID</TableCell>
                            <TableCell>Class Prefect ID</TableCell>
                            <TableCell>Students</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(classes) &&
                            classes.map((classItem) => (
                                <TableRow key={classItem.id}>
                                    <TableCell>{classItem.id}</TableCell>
                                    <TableCell>{classItem.name}</TableCell>
                                    <TableCell>
                                        {classItem.school
                                            ? classItem.school.name
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {classItem.classTeacher
                                            ? `${classItem.classTeacher.first_name} ${classItem.classTeacher.last_name}`
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {classItem.classPrefect
                                            ? `${classItem.classPrefect.first_name} ${classItem.classPrefect.last_name}`
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {classItem.students &&
                                        classItem.students.length > 0 ? (
                                            <ul>
                                                {classItem.students.map(
                                                    (student) => (
                                                        <li
                                                            key={student.id}
                                                        >{`${student.first_name} ${student.last_name}`}</li>
                                                    )
                                                )}
                                            </ul>
                                        ) : (
                                            'N/A'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() =>
                                                handleDeleteClass(classItem.id)
                                            }
                                            style={{ marginRight: '10px' }}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() =>
                                                openEditModal(classItem)
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
            {/* Create Class form */}
            <Box mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowCreateForm(true)}
                >
                    Create Class
                </Button>
            </Box>
            {showCreateForm && (
                <Box mt={2}>
                    <Typography variant="h6" gutterBottom>
                        Create New Class
                    </Typography>
                    <TextField
                        label="Name"
                        value={newClass.name}
                        onChange={(e) => handleNewClassChange(e, 'name')}
                        fullWidth
                        margin="normal"
                        required={true}
                        inputProps={{ maxLength: 10 }}
                        error={newClassErrors.name !== ''}
                        helperText={newClassErrors.name}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="schoolId-label">School</InputLabel>
                        <Select
                            labelId="schoolId-label"
                            value={newClass.schoolId}
                            onChange={(e) =>
                                setNewClass({
                                    ...newClass,
                                    schoolId: e.target.value,
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
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="classTeacherId-label">
                            Class Teacher
                        </InputLabel>
                        <Select
                            labelId="classTeacherId-label"
                            value={newClass.classTeacherId}
                            onChange={(e) =>
                                setNewClass({
                                    ...newClass,
                                    classTeacherId: e.target.value,
                                })
                            }
                        >
                            {Array.isArray(teachers.teachers) &&
                                teachers.teachers.map((teacher) => (
                                    <MenuItem
                                        key={teacher.id}
                                        value={teacher.id}
                                    >
                                        {teacher.first_name} {teacher.last_name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="classPrefectId-label">
                            Class Prefect
                        </InputLabel>
                        <Select
                            labelId="classPrefectId-label"
                            value={newClass.classPrefectId}
                            onChange={(e) =>
                                setNewClass({
                                    ...newClass,
                                    classPrefectId: e.target.value,
                                })
                            }
                        >
                            {Array.isArray(students.students) &&
                                students.students.map((student) => (
                                    <MenuItem
                                        key={student.id}
                                        value={student.id}
                                    >
                                        {student.first_name} {student.last_name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="students-label">Students</InputLabel>
                        <Select
                            labelId="students-label"
                            multiple
                            value={selectedStudents}
                            onChange={handleStudentsChange}
                            renderValue={(selected) =>
                                selected
                                    .map((id) => {
                                        const student = students.find(
                                            (s) => s.id === id
                                        )
                                        return student
                                            ? `${student.first_name} ${student.last_name}`
                                            : ''
                                    })
                                    .join(', ')
                            }
                        >
                            {students.map((student) => (
                                <MenuItem key={student.id} value={student.id}>
                                    <Checkbox
                                        checked={
                                            selectedStudents.indexOf(
                                                student.id
                                            ) > -1
                                        }
                                    />
                                    <ListItemText
                                        primary={`${student.first_name} ${student.last_name}`}
                                    />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateClass}
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
            {/* Edit Class modal */}
            <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Edit Class
                    </Typography>
                    <TextField
                        label="Name"
                        name="name"
                        value={editClassData.name}
                        onChange={(e) => handleEditClassChange(e, 'name')}
                        fullWidth
                        margin="normal"
                        required={true}
                        inputProps={{ maxLength: 10 }}
                        error={editClassErrors.name !== ''}
                        helperText={editClassErrors.name}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>School ID</InputLabel>
                        <Select
                            name="schoolId"
                            value={editClassData.schoolId}
                            onChange={handleChange}
                        >
                            {schools.map((school) => (
                                <MenuItem key={school.id} value={school.id}>
                                    {school.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Class Teacher ID</InputLabel>
                        <Select
                            name="classTeacherId"
                            value={editClassData.classTeacherId}
                            onChange={handleChange}
                        >
                            {Array.isArray(teachers.teachers) &&
                                teachers.teachers.map((teacher) => (
                                    <MenuItem
                                        key={teacher.id}
                                        value={teacher.id}
                                    >
                                        {`${teacher.first_name} ${teacher.last_name}`}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Class Prefect ID</InputLabel>
                        <Select
                            name="classPrefectId"
                            value={editClassData.classPrefectId}
                            onChange={handleChange}
                        >
                            {Array.isArray(students.students) &&
                                students.students.map((student) => (
                                    <MenuItem
                                        key={student.id}
                                        value={student.id}
                                    >
                                        {`${student.first_name} ${student.last_name}`}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="edit-students-label">
                            Students
                        </InputLabel>
                        <Select
                            labelId="edit-students-label"
                            multiple
                            value={editSelectedStudents}
                            onChange={handleEditStudentsChange}
                            renderValue={(selected) =>
                                selected
                                    .map((id) => {
                                        const student = students.find(
                                            (s) => s.id === id
                                        )
                                        return student
                                            ? `${student.first_name} ${student.last_name}`
                                            : ''
                                    })
                                    .join(', ')
                            }
                        >
                            {students.map((student) => (
                                <MenuItem key={student.id} value={student.id}>
                                    <Checkbox
                                        checked={
                                            editSelectedStudents.indexOf(
                                                student.id
                                            ) > -1
                                        }
                                    />
                                    <ListItemText
                                        primary={`${student.first_name} ${student.last_name}`}
                                    />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditClass}
                        >
                            Save
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setShowEditModal(false)}
                            style={{ marginLeft: '10px' }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
            {/* Delete confirmation dialog */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this class?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmOpen(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteClass} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ClassTable
