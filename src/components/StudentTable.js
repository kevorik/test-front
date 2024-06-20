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
} from '@mui/material'

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

    useEffect(() => {
        getStudents().then((response) => setStudents(response.data))
        getClasses().then((response) => setClasses(response.data))
    }, [])

    const handleCreateStudent = async () => {
        try {
            const response = await createStudent({
                first_name: newStudent.first_name,
                last_name: newStudent.last_name,
                middle_name: newStudent.middle_name,
                class: { id: newStudent.class.id },
            })

            if (response.status === 201) {
                getStudents().then((response) => setStudents(response.data))
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
        try {
            await updateStudent(selectedStudent.id, selectedStudent)
            getStudents().then((response) => setStudents(response.data)) // Refresh the student list
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
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Middle Name</TableCell>
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
                        onChange={(e) =>
                            setNewStudent({
                                ...newStudent,
                                first_name: e.target.value,
                            })
                        }
                        fullWidth
                        margin="normal"
                        required={true}
                        inputProps={{ maxLength: 20 }}
                    />
                    <TextField
                        label="Last Name"
                        value={newStudent.last_name}
                        onChange={(e) =>
                            setNewStudent({
                                ...newStudent,
                                last_name: e.target.value,
                            })
                        }
                        fullWidth
                        margin="normal"
                        required={true}
                        inputProps={{ maxLength: 20 }}
                    />
                    <TextField
                        label="Middle Name"
                        value={newStudent.middle_name}
                        onChange={(e) =>
                            setNewStudent({
                                ...newStudent,
                                middle_name: e.target.value,
                            })
                        }
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
                            {classes.map((classItem) => (
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
                                setSelectedStudent({
                                    ...selectedStudent,
                                    first_name: e.target.value,
                                })
                            }
                            fullWidth
                            margin="normal"
                            required={true}
                            inputProps={{ maxLength: 20 }}
                        />
                        <TextField
                            label="Last Name"
                            value={selectedStudent.last_name}
                            onChange={(e) =>
                                setSelectedStudent({
                                    ...selectedStudent,
                                    last_name: e.target.value,
                                })
                            }
                            fullWidth
                            margin="normal"
                            required={true}
                            inputProps={{ maxLength: 20 }}
                        />
                        <TextField
                            label="Middle Name"
                            value={selectedStudent.middle_name}
                            onChange={(e) =>
                                setSelectedStudent({
                                    ...selectedStudent,
                                    middle_name: e.target.value,
                                })
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
                                {classes.map((classItem) => (
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
