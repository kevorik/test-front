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
} from '@mui/material'

const ClassTable = () => {
    const [classes, setClasses] = useState([])
    const [teachers, setTeachers] = useState([])
    const [students, setStudents] = useState([])
    const [schools, setSchools] = useState([])
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editClassData, setEditClassData] = useState({
        id: '',
        name: '',
        school: { id: '' },
        classTeacher: { id: '' },
        classPrefect: { id: '' },
    })

    const [newClass, setNewClass] = useState({
        name: '',
        school: { id: '' },
        classTeacher: { id: '' },
        classPrefect: { id: '' },
    })

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedClassId, setSelectedClassId] = useState(null)

    useEffect(() => {
        fetchClasses()
        fetchTeachers()
        fetchStudents()
        fetchSchools()
    }, [])

    const fetchClasses = async () => {
        try {
            const response = await getClasses()
            setClasses(response.data)
        } catch (error) {
            console.error('Error fetching classes:', error)
        }
    }

    const fetchTeachers = async () => {
        try {
            const response = await getTeachers()
            setTeachers(response.data)
        } catch (error) {
            console.error('Error fetching teachers:', error)
        }
    }

    const fetchStudents = async () => {
        try {
            const response = await getStudents()
            setStudents(response.data)
        } catch (error) {
            console.error('Error fetching students:', error)
        }
    }

    const fetchSchools = async () => {
        try {
            const response = await getSchools()
            const { schools } = response.data
            setSchools(schools || [])
        } catch (error) {
            console.error('Error fetching schools:', error)
            setSchools([]) // Если произошла ошибка, установите пустой массив
        }
    }

    const handleCreateClass = async () => {
        try {
            await createClass(newClass)
            fetchClasses()
            setShowCreateForm(false)
            setNewClass({
                name: '',
                school: { id: '' },
                classTeacher: { id: '' },
                classPrefect: { id: '' },
            })
        } catch (error) {
            console.error('Error creating class:', error)
        }
    }

    const handleDeleteClass = (classId) => {
        setSelectedClassId(classId)
        setConfirmOpen(true)
    }

    const confirmDeleteClass = async () => {
        try {
            await deleteClass(selectedClassId)
            fetchClasses()
            setConfirmOpen(false)
            setSelectedClassId(null)
        } catch (error) {
            console.error('Error deleting class:', error)
        }
    }

    const handleEditClass = async () => {
        try {
            await updateClass(editClassData.id, editClassData)
            fetchClasses()
            setShowEditModal(false)
        } catch (error) {
            console.error('Error updating class:', error)
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        let updatedValue = value

        if (name === 'school') {
            const selectedSchool = schools.find((school) => school.id === value)
            updatedValue = { id: selectedSchool.id, name: selectedSchool.name }
        } else if (name === 'classTeacher') {
            const selectedTeacher = teachers.find(
                (teacher) => teacher.id === value
            )
            updatedValue = {
                id: selectedTeacher.id,
                name: `${selectedTeacher.first_name} ${selectedTeacher.last_name}`,
            }
        } else if (name === 'classPrefect') {
            const selectedPrefect = students.find(
                (student) => student.id === value
            )
            updatedValue = {
                id: selectedPrefect.id,
                name: `${selectedPrefect.first_name} ${selectedPrefect.last_name}`,
            }
        }

        setEditClassData({
            ...editClassData,
            [name]: updatedValue,
        })
    }

    const openEditModal = (classItem) => {
        setEditClassData({
            id: classItem.id,
            name: classItem.name,
            school: { id: classItem.school.id, name: classItem.school.name },
            classTeacher: {
                id: classItem.classTeacher.id,
                name: `${classItem.classTeacher.first_name} ${classItem.classTeacher.last_name}`,
            },
            classPrefect: {
                id: classItem.classPrefect.id,
                name: `${classItem.classPrefect.first_name} ${classItem.classPrefect.last_name}`,
            },
        })
        setShowEditModal(true)
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Classes
            </Typography>
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
                        {classes.map((classItem) => (
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
                                        onClick={() => openEditModal(classItem)}
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
                        onChange={(e) =>
                            setNewClass({ ...newClass, name: e.target.value })
                        }
                        fullWidth
                        margin="normal"
                        required={true}
                        inputProps={{ maxLength: 10 }}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="schoolId-label">School</InputLabel>
                        <Select
                            labelId="schoolId-label"
                            value={newClass.school.id}
                            onChange={(e) =>
                                setNewClass({
                                    ...newClass,
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
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="classTeacherId-label">
                            Class Teacher
                        </InputLabel>
                        <Select
                            labelId="classTeacherId-label"
                            value={newClass.classTeacher.id}
                            onChange={(e) =>
                                setNewClass({
                                    ...newClass,
                                    classTeacher: { id: e.target.value },
                                })
                            }
                        >
                            {teachers.map((teacher) => (
                                <MenuItem key={teacher.id} value={teacher.id}>
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
                            value={newClass.classPrefect.id}
                            onChange={(e) =>
                                setNewClass({
                                    ...newClass,
                                    classPrefect: { id: e.target.value },
                                })
                            }
                        >
                            {students.map((student) => (
                                <MenuItem key={student.id} value={student.id}>
                                    {student.first_name} {student.last_name}
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
                        onChange={(e) =>
                            setEditClassData({
                                ...editClassData,
                                name: e.target.value,
                            })
                        }
                        fullWidth
                        margin="normal"
                        required={true}
                        inputProps={{ maxLength: 10 }}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>School ID</InputLabel>
                        <Select
                            name="school"
                            value={editClassData.school.id}
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
                            name="classTeacher"
                            value={editClassData.classTeacher.id}
                            onChange={handleChange}
                        >
                            {teachers.map((teacher) => (
                                <MenuItem key={teacher.id} value={teacher.id}>
                                    {`${teacher.first_name} ${teacher.last_name}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Class Prefect ID</InputLabel>
                        <Select
                            name="classPrefect"
                            value={editClassData.classPrefect.id}
                            onChange={handleChange}
                        >
                            {students.map((student) => (
                                <MenuItem key={student.id} value={student.id}>
                                    {`${student.first_name} ${student.last_name}`}
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
