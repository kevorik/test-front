import React, { useEffect, useState } from 'react'
import {
    getStudents,
    createStudent,
    getClasses,
    deleteStudent,
    updateStudent,
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
    TableSortLabel,
} from '@mui/material'
import PaginationComponent from './PaginationComponent'

const StudentTable = () => {
    const [students, setStudents] = useState([])
    const [classes, setClasses] = useState([])
    const [showCreateStudentForm, setShowCreateStudentForm] = useState(false)
    const [showEditStudentForm, setShowEditStudentForm] = useState(false)
    const [newStudent, setNewStudent] = useState({
        first_name: '',
        last_name: '',
        middle_name: '',
        class: { id: '' },
    })
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedStudentId, setSelectedStudentId] = useState(null)
    const [sortColumn, setSortColumn] = useState(null)
    const [sortDirection, setSortDirection] = useState('asc')
    const [page, setPage] = useState(1)
    const [limit] = useState(5)
    const [total, setTotal] = useState(0)
    const [newStudentErrors, setNewStudentErrors] = useState({
        first_name: '',
        last_name: '',
    })
    const [editStudentErrors, setEditStudentErrors] = useState({
        first_name: '',
        last_name: '',
    })

    useEffect(() => {
        fetchStudents(page, limit)
        fetchClasses()
    }, [page])

    const fetchStudents = async (page, limit) => {
        try {
            const response = await getStudents(page, limit)
            const { students, total } = response.data
            setStudents(students || [])
            setTotal(total || 0)
        } catch (error) {
            console.error('Error fetching students:', error)
        }
    }

    const fetchClasses = async () => {
        try {
            const response = await getClasses()
            setClasses(response.data)
        } catch (error) {
            console.error('Error fetching classes:', error)
        }
    }

    const handleCreateStudent = async () => {
        const errors = {}
        if (newStudent.first_name.trim() === '') {
            errors.first_name = 'First Name is required'
        } else if (!validateName(newStudent.first_name)) {
            errors.first_name = 'First Name should not contain digits'
        }
        if (newStudent.last_name.trim() === '') {
            errors.last_name = 'Last Name is required'
        } else if (!validateName(newStudent.last_name)) {
            errors.last_name = 'Last Name should not contain digits'
        }
        setNewStudentErrors(errors)

        if (Object.keys(errors).length > 0) return

        try {
            const response = await createStudent({
                first_name: newStudent.first_name,
                last_name: newStudent.last_name,
                middle_name: newStudent.middle_name,
                class: { id: newStudent.class.id },
            })

            if (response.status === 201) {
                fetchStudents(page, limit)
                setShowCreateStudentForm(false)
                setNewStudent({
                    first_name: '',
                    last_name: '',
                    middle_name: '',
                    class: { id: '' },
                })
            }
        } catch (error) {
            console.error('Error creating student:', error)
        }
    }

    const handleEditStudent = (student) => {
        setSelectedStudent(student)
        setShowEditStudentForm(true)
    }

    const handleUpdateStudent = async () => {
        const errors = {}
        if (selectedStudent.first_name.trim() === '') {
            errors.first_name = 'First Name is required'
        } else if (!validateName(selectedStudent.first_name)) {
            errors.first_name = 'First Name should not contain digits'
        }
        if (selectedStudent.last_name.trim() === '') {
            errors.last_name = 'Last Name is required'
        } else if (!validateName(selectedStudent.last_name)) {
            errors.last_name = 'Last Name should not contain digits'
        }
        setEditStudentErrors(errors)

        if (Object.keys(errors).length > 0) return

        try {
            await updateStudent(selectedStudent.id, selectedStudent)
            fetchStudents(page, limit)
            setShowEditStudentForm(false)
            setSelectedStudent(null)
        } catch (error) {
            console.error('Error updating student:', error)
        }
    }

    const handleDeleteStudent = (studentId) => {
        setSelectedStudentId(studentId)
        setConfirmOpen(true)
    }

    const confirmDeleteStudent = async () => {
        try {
            await deleteStudent(selectedStudentId)
            setStudents((prevStudents) =>
                prevStudents.filter(
                    (student) => student.id !== selectedStudentId
                )
            )
            setConfirmOpen(false)
            setSelectedStudentId(null)
        } catch (error) {
            console.error('Error deleting student:', error)
        }
    }

    const sortStudents = (column) => {
        const isAsc = sortColumn === column && sortDirection === 'asc'
        const sortedStudents = [...students].sort((a, b) => {
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

        setStudents(sortedStudents)
        setSortColumn(column)
        setSortDirection(isAsc ? 'desc' : 'asc')
    }

    const handleChangePage = (event, value) => {
        setPage(value)
    }

    const validateName = (name) => {
        const regex = /^[^\d]*$/
        return regex.test(name)
    }

    const handleInputChange = (e, field) => {
        const { value } = e.target
        setNewStudent({ ...newStudent, [field]: value })
        if (value.trim() !== '' && validateName(value)) {
            setNewStudentErrors({ ...newStudentErrors, [field]: '' })
        }
    }

    const handleEditInputChange = (e, field) => {
        const { value } = e.target
        setSelectedStudent({ ...selectedStudent, [field]: value })
        if (value.trim() !== '' && validateName(value)) {
            setEditStudentErrors({ ...editStudentErrors, [field]: '' })
        }
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Students
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
                                    onClick={() => sortStudents('first_name')}
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
                                    onClick={() => sortStudents('last_name')}
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
                                    onClick={() => sortStudents('middle_name')}
                                >
                                    Middle Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Class</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell>{student.id}</TableCell>
                                <TableCell>{student.first_name}</TableCell>
                                <TableCell>{student.last_name}</TableCell>
                                <TableCell>{student.middle_name}</TableCell>
                                <TableCell>
                                    {student.class ? student.class.name : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() =>
                                            handleDeleteStudent(student.id)
                                        }
                                        style={{ marginRight: '10px' }}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                            handleEditStudent(student)
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
                    onClick={() => setShowCreateStudentForm(true)}
                >
                    Create Student
                </Button>
            </Box>
            {showCreateStudentForm && (
                <Box mt={2}>
                    <Typography variant="h6" gutterBottom>
                        Create New Student
                    </Typography>
                    <TextField
                        label="First Name"
                        value={newStudent.first_name}
                        onChange={(e) => handleInputChange(e, 'first_name')}
                        fullWidth
                        margin="normal"
                        required={true}
                        inputProps={{ maxLength: 20 }}
                        error={Boolean(newStudentErrors.first_name)}
                        helperText={newStudentErrors.first_name}
                    />
                    <TextField
                        label="Last Name"
                        value={newStudent.last_name}
                        onChange={(e) => handleInputChange(e, 'last_name')}
                        fullWidth
                        margin="normal"
                        required={true}
                        inputProps={{ maxLength: 20 }}
                        error={Boolean(newStudentErrors.last_name)}
                        helperText={newStudentErrors.last_name}
                    />
                    <TextField
                        label="Middle Name"
                        value={newStudent.middle_name}
                        onChange={(e) => handleInputChange(e, 'middle_name')}
                        fullWidth
                        margin="normal"
                        inputProps={{ maxLength: 20 }}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="classId-label">Class</InputLabel>
                        <Select
                            labelId="classId-label"
                            value={newStudent.class.id}
                            onChange={(e) =>
                                setNewStudent({
                                    ...newStudent,
                                    class: { id: e.target.value },
                                })
                            }
                        >
                            {Array.isArray(classes.classes) &&
                                classes.classes.map((classItem) => (
                                    <MenuItem
                                        key={classItem.id}
                                        value={classItem.id}
                                    >
                                        {classItem.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateStudent}
                        >
                            Save
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setShowCreateStudentForm(false)}
                            style={{ marginLeft: '10px' }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            )}

            {showEditStudentForm && selectedStudent && (
                <Dialog
                    open={showEditStudentForm}
                    onClose={() => setShowEditStudentForm(false)}
                >
                    <DialogTitle>Edit Student</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="First Name"
                            value={selectedStudent.first_name}
                            onChange={(e) =>
                                handleEditInputChange(e, 'first_name')
                            }
                            fullWidth
                            margin="normal"
                            required={true}
                            inputProps={{ maxLength: 20 }}
                            error={Boolean(editStudentErrors.first_name)}
                            helperText={editStudentErrors.first_name}
                        />
                        <TextField
                            label="Last Name"
                            value={selectedStudent.last_name}
                            onChange={(e) =>
                                handleEditInputChange(e, 'last_name')
                            }
                            fullWidth
                            margin="normal"
                            required={true}
                            inputProps={{ maxLength: 20 }}
                            error={Boolean(editStudentErrors.last_name)}
                            helperText={editStudentErrors.last_name}
                        />
                        <TextField
                            label="Middle Name"
                            value={selectedStudent.middle_name}
                            onChange={(e) =>
                                handleEditInputChange(e, 'middle_name')
                            }
                            fullWidth
                            margin="normal"
                            inputProps={{ maxLength: 20 }}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="editClassId-label">
                                Class
                            </InputLabel>
                            <Select
                                labelId="editClassId-label"
                                value={selectedStudent.class.id}
                                onChange={(e) =>
                                    setSelectedStudent({
                                        ...selectedStudent,
                                        class: { id: e.target.value },
                                    })
                                }
                            >
                                {Array.isArray(classes.classes) &&
                                    classes.classes.map((classItem) => (
                                        <MenuItem
                                            key={classItem.id}
                                            value={classItem.id}
                                        >
                                            {classItem.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setShowEditStudentForm(false)}
                            color="secondary"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateStudent} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this student?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmOpen(false)}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteStudent} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default StudentTable
