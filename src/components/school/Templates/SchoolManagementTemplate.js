import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Heading from '../Atoms/Heading'
import SchoolForm from '../Organisms/SchoolForm'
import SchoolTable from '../Organisms/SchoolTable'
import PaginationComponent from '../../PaginationComponent'
import Modal from '../Atoms/Modal'
import ConfirmDialog from '../Molecules/ConfirmDialog'
import Button from '../Atoms/Button'
import {
    getSchools,
    createSchool,
    deleteSchool,
    updateSchool,
} from '../../../services/api'

const SchoolManagementTemplate = () => {
    const [schools, setSchools] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editSchoolData, setEditSchoolData] = useState({
        id: '',
        name: '',
        address: '',
        isActive: true,
        foundedDate: null,
        levelId: '',
    })
    const [sortColumn, setSortColumn] = useState('id')
    const [sortDirection, setSortDirection] = useState('asc')
    const [newSchool, setNewSchool] = useState({
        name: '',
        address: '',
        isActive: true,
        foundedDate: null,
        levelId: '',
    })
    const [newSchoolErrors, setNewSchoolErrors] = useState({})
    const [editSchoolErrors, setEditSchoolErrors] = useState({})
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedSchoolId, setSelectedSchoolId] = useState(null)

    useEffect(() => {
        fetchSchools(page, limit, sortColumn, sortDirection)
    }, [page, limit, sortColumn, sortDirection])

    const fetchSchools = async (page, limit, sortColumn, sortDirection) => {
        try {
            const response = await getSchools(
                page,
                limit,
                sortColumn,
                sortDirection
            )
            const { schools, total } = response.data
            setSchools(schools || [])
            setTotal(total || 0)
        } catch (error) {
            console.error('Error fetching schools:', error)
        }
    }

    const handleCreateSchool = async () => {
        const errors = {}
        if (newSchool.name.trim() === '') errors.name = 'Name is required'
        if (newSchool.address.trim() === '')
            errors.address = 'Address is required'
        if (!newSchool.levelId) errors.levelId = 'Level is required'
        setNewSchoolErrors(errors)

        if (Object.keys(errors).length > 0) return

        try {
            await createSchool(newSchool)
            fetchSchools(page, limit, sortColumn, sortDirection)
            setShowCreateForm(false)
            setNewSchool({
                name: '',
                address: '',
                isActive: true,
                foundedDate: null,
                levelId: '',
            })
        } catch (error) {
            console.error('Error creating school:', error)
        }
    }

    const handleDeleteSchool = (schoolId) => {
        setSelectedSchoolId(schoolId)
        setConfirmOpen(true)
    }

    const confirmDeleteSchool = async () => {
        try {
            await deleteSchool(selectedSchoolId)
            fetchSchools(page, limit, sortColumn, sortDirection)
            setConfirmOpen(false)
            setSelectedSchoolId(null)
        } catch (error) {
            console.error('Error deleting school:', error)
        }
    }

    const handleEditSchool = async () => {
        const errors = {}
        if (editSchoolData.name.trim() === '') errors.name = 'Name is required'
        if (editSchoolData.address.trim() === '')
            errors.address = 'Address is required'
        if (!editSchoolData.levelId) errors.levelId = 'Level is required'
        setEditSchoolErrors(errors)

        if (Object.keys(errors).length > 0) return

        try {
            await updateSchool(editSchoolData.id, editSchoolData)
            fetchSchools(page, limit, sortColumn, sortDirection)
            setShowEditModal(false)
        } catch (error) {
            console.error('Error updating school:', error)
        }
    }

    const openEditModal = (school) => {
        setEditSchoolData({
            id: school.id,
            name: school.name,
            address: school.address,
            isActive: school.isActive,
            foundedDate: school.foundedDate,
            levelId: school.levelId || '', // Заполняем новое поле
        })
        setShowEditModal(true)
    }

    const handleChangePage = (event, value) => {
        setPage(value)
    }

    const handleSortRequest = (column) => {
        const isAsc = sortColumn === column && sortDirection === 'asc'
        setSortDirection(isAsc ? 'desc' : 'asc')
        setSortColumn(column)
    }

    const handleNewSchoolChange = (e, field) => {
        let value = e.target.value

        if (field === 'isActive') {
            value = e.target.checked
        } else if (field === 'foundedDate') {
            value = e.target.value
        } else {
            value = typeof value === 'string' ? value.trim() : value
        }

        setNewSchool({ ...newSchool, [field]: value })
        if (typeof value === 'string' && value.trim() !== '') {
            setNewSchoolErrors({ ...newSchoolErrors, [field]: '' })
        }
    }

    const handleEditSchoolChange = (e, field) => {
        let value = e.target.value

        if (field === 'isActive') {
            value = e.target.checked
        } else if (field === 'foundedDate') {
            value = e.target.value
        } else {
            value = typeof value === 'string' ? value.trim() : value
        }

        setEditSchoolData({ ...editSchoolData, [field]: value })

        if (typeof value === 'string' && value.trim() !== '') {
            setEditSchoolErrors({ ...editSchoolErrors, [field]: '' })
        }
    }

    return (
        <div>
            <Heading variant="h4" gutterBottom>
                Schools
            </Heading>
            <SchoolTable
                schools={schools}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSortRequest}
                onEdit={openEditModal}
                onDelete={handleDeleteSchool}
            />
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
                <SchoolForm
                    school={newSchool}
                    errors={newSchoolErrors}
                    onChange={handleNewSchoolChange}
                    onSave={handleCreateSchool}
                    onCancel={() => setShowCreateForm(false)}
                />
            )}
            <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
                <SchoolForm
                    school={editSchoolData}
                    errors={editSchoolErrors}
                    onChange={handleEditSchoolChange}
                    onSave={handleEditSchool}
                    onCancel={() => setShowEditModal(false)}
                />
            </Modal>
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmDeleteSchool}
                title="Confirm Deletion"
                content="Are you sure you want to delete this school?"
            />
        </div>
    )
}

export default SchoolManagementTemplate
