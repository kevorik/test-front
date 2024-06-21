import React, { useEffect, useState } from 'react'
import {
    getSchools,
    createSchool,
    deleteSchool,
    updateSchool,
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
    Modal,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TableSortLabel,
} from '@mui/material'
import PaginationComponent from './PaginationComponent'

const SchoolTable = () => {
    // Состояния для хранения списка школ, общей суммы, текущей страницы и лимита на страницу
    const [schools, setSchools] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [limit] = useState(10)

    // Состояния для управления отображением форм и модальных окон
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editSchoolData, setEditSchoolData] = useState({
        id: '',
        name: '',
        address: '',
    })

    // Состояния для управления сортировкой
    const [sortColumn, setSortColumn] = useState(null)
    const [sortDirection, setSortDirection] = useState('asc')

    // Состояние для хранения данных новой школы
    const [newSchool, setNewSchool] = useState({ name: '', address: '' })

    // Состояния для подтверждения удаления
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedSchoolId, setSelectedSchoolId] = useState(null)

    // Загружаем список школ при изменении страницы
    useEffect(() => {
        fetchSchools(page, limit)
    }, [page])

    // Функция для получения списка школ
    const fetchSchools = async (page, limit) => {
        try {
            const response = await getSchools(page, limit)
            const { schools, total } = response.data
            setSchools(schools || [])
            setTotal(total || 0)
        } catch (error) {
            console.error('Error fetching schools:', error)
        }
    }

    // Функция для создания новой школы
    const handleCreateSchool = async () => {
        try {
            await createSchool(newSchool)
            fetchSchools(page, limit)
            setShowCreateForm(false)
            setNewSchool({ name: '', address: '' })
        } catch (error) {
            console.error('Error creating school:', error)
        }
    }

    // Устанавливаем ID школы для удаления и открываем окно подтверждения
    const handleDeleteSchool = (schoolId) => {
        setSelectedSchoolId(schoolId)
        setConfirmOpen(true)
    }

    // Функция для подтверждения удаления школы
    const confirmDeleteSchool = async () => {
        try {
            await deleteSchool(selectedSchoolId)
            fetchSchools(page, limit)
            setConfirmOpen(false)
            setSelectedSchoolId(null)
        } catch (error) {
            console.error('Error deleting school:', error)
        }
    }

    // Функция для редактирования данных школы
    const handleEditSchool = async () => {
        try {
            await updateSchool(editSchoolData.id, editSchoolData)
            fetchSchools(page, limit)
            setShowEditModal(false)
        } catch (error) {
            console.error('Error updating school:', error)
        }
    }

    // Открываем модальное окно редактирования и устанавливаем данные выбранной школы
    const openEditModal = (school) => {
        setEditSchoolData({
            id: school.id,
            name: school.name,
            address: school.address,
        })
        setShowEditModal(true)
    }

    // Обработка изменения страницы
    const handleChangePage = (event, value) => {
        setPage(value)
    }

    // Функция для сортировки списка школ
    const sortSchools = (column) => {
        const isAsc = sortColumn === column && sortDirection === 'asc'
        const sortedSchools = [...schools].sort((a, b) => {
            if (column === 'name' || column === 'address') {
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

        setSchools(sortedSchools)
        setSortColumn(column)
        setSortDirection(isAsc ? 'desc' : 'asc')
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Schools
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === 'name'}
                                    direction={
                                        sortColumn === 'name'
                                            ? sortDirection
                                            : 'asc'
                                    }
                                    onClick={() => sortSchools('name')}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === 'address'}
                                    direction={
                                        sortColumn === 'address'
                                            ? sortDirection
                                            : 'asc'
                                    }
                                    onClick={() => sortSchools('address')}
                                >
                                    Address
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(schools) &&
                            schools.map((school) => (
                                <TableRow key={school.id}>
                                    <TableCell>{school.id}</TableCell>
                                    <TableCell>{school.name}</TableCell>
                                    <TableCell>{school.address}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() =>
                                                handleDeleteSchool(school.id)
                                            }
                                            style={{ marginRight: '10px' }}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() =>
                                                openEditModal(school)
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
                    Create School
                </Button>
            </Box>
            {showCreateForm && (
                <Box mt={2}>
                    <Typography variant="h6" gutterBottom>
                        Create New School
                    </Typography>
                    <TextField
                        label="Name"
                        value={newSchool.name}
                        onChange={(e) =>
                            setNewSchool({ ...newSchool, name: e.target.value })
                        }
                        fullWidth
                        margin="normal"
                        required={true}
                        inputProps={{ maxLength: 20 }}
                    />
                    <TextField
                        label="Address"
                        value={newSchool.address}
                        onChange={(e) =>
                            setNewSchool({
                                ...newSchool,
                                address: e.target.value,
                            })
                        }
                        fullWidth
                        margin="normal"
                        required={true}
                        inputProps={{ maxLength: 20 }}
                    />
                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateSchool}
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
                        Edit School
                    </Typography>
                    <TextField
                        label="Name"
                        value={editSchoolData.name}
                        onChange={(e) =>
                            setEditSchoolData({
                                ...editSchoolData,
                                name: e.target.value,
                            })
                        }
                        fullWidth
                        margin="normal"
                        inputProps={{ maxLength: 20 }}
                    />
                    <TextField
                        label="Address"
                        value={editSchoolData.address}
                        onChange={(e) =>
                            setEditSchoolData({
                                ...editSchoolData,
                                address: e.target.value,
                            })
                        }
                        fullWidth
                        margin="normal"
                        inputProps={{ maxLength: 40 }}
                    />
                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditSchool}
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
                        Are you sure you want to delete this school?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmOpen(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteSchool} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default SchoolTable
