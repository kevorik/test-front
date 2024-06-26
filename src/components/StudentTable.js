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
        classId: '',
    })
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedStudentId, setSelectedStudentId] = useState(null)
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [total, setTotal] = useState(0)
    const [newStudentErrors, setNewStudentErrors] = useState({
        first_name: '',
        last_name: '',
    })
    const [editStudentErrors, setEditStudentErrors] = useState({
        first_name: '',
        last_name: '',
    })

    const [sortColumn, setSortColumn] = useState('id')
    const [sortDirection, setSortDirection] = useState('asc')

    useEffect(() => {
        fetchStudents(page, limit, sortColumn, sortDirection)
        fetchClasses()
    }, [page, limit, sortColumn, sortDirection])

    const fetchStudents = async (page, limit, sortColumn, sortDirection) => {
        try {
            const response = await getStudents(
                page,
                limit,
                sortColumn,
                sortDirection
            )
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
                classId: newStudent.classId,
            })

            if (response.status === 201) {
                fetchStudents(page, limit, sortColumn, sortDirection)
                setShowCreateStudentForm(false)
                setNewStudent({
                    first_name: '',
                    last_name: '',
                    middle_name: '',
                    classId: '',
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
            await updateStudent(selectedStudent.id, selectedStudent) // Pass selectedStudent directly
            fetchStudents(page, limit, sortColumn, sortDirection)
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

    const handleSortRequest = (column) => {
        const isAsc = sortColumn === column && sortDirection === 'asc'
        setSortDirection(isAsc ? 'desc' : 'asc')
        setSortColumn(column)
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
                            <TableCell
                                sortDirection={
                                    sortColumn === 'first_name'
                                        ? sortDirection
                                        : false
                                }
                            >
                                <TableSortLabel
                                    active={sortColumn === 'first_name'}
                                    direction={
                                        sortColumn === 'first_name'
                                            ? sortDirection
                                            : 'asc'
                                    }
                                    onClick={() =>
                                        handleSortRequest('first_name')
                                    }
                                >
                                    First Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell
                                sortDirection={
                                    sortColumn === 'last_name'
                                        ? sortDirection
                                        : false
                                }
                            >
                                <TableSortLabel
                                    active={sortColumn === 'last_name'}
                                    direction={
                                        sortColumn === 'last_name'
                                            ? sortDirection
                                            : 'asc'
                                    }
                                    onClick={() =>
                                        handleSortRequest('last_name')
                                    }
                                >
                                    Last Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell
                                sortDirection={
                                    sortColumn === 'middle_name'
                                        ? sortDirection
                                        : false
                                }
                            >
                                <TableSortLabel
                                    active={sortColumn === 'middle_name'}
                                    direction={
                                        sortColumn === 'middle_name'
                                            ? sortDirection
                                            : 'asc'
                                    }
                                    onClick={() =>
                                        handleSortRequest('middle_name')
                                    }
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
                            value={newStudent.classId}
                            onChange={(e) =>
                                setNewStudent({
                                    ...newStudent,
                                    classId: e.target.value,
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
                                value={selectedStudent.classId}
                                onChange={(e) =>
                                    setSelectedStudent({
                                        ...selectedStudent,
                                        classId: e.target.value,
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
