// import React, { useEffect, useState } from 'react'
// import {
//     getSchools,
//     createSchool,
//     deleteSchool,
//     updateSchool,
// } from '../services/api'
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Typography,
//     Button,
//     TextField,
//     Box,
//     Modal,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogContentText,
//     DialogTitle,
//     TableSortLabel,
// } from '@mui/material'
// import PaginationComponent from './PaginationComponent'

// const SchoolTable = () => {
//     const [schools, setSchools] = useState([])
//     const [total, setTotal] = useState(0)
//     const [page, setPage] = useState(1)
//     const [limit] = useState(10)

//     const [showCreateForm, setShowCreateForm] = useState(false)
//     const [showEditModal, setShowEditModal] = useState(false)
//     const [editSchoolData, setEditSchoolData] = useState({
//         id: '',
//         name: '',
//         address: '',
//     })

//     const [sortColumn, setSortColumn] = useState('id')
//     const [sortDirection, setSortDirection] = useState('asc')

//     const [newSchool, setNewSchool] = useState({ name: '', address: '' })
//     const [newSchoolErrors, setNewSchoolErrors] = useState({
//         name: '',
//         address: '',
//     })

//     const [editSchoolErrors, setEditSchoolErrors] = useState({
//         name: '',
//         address: '',
//     })

//     const [confirmOpen, setConfirmOpen] = useState(false)
//     const [selectedSchoolId, setSelectedSchoolId] = useState(null)

//     useEffect(() => {
//         fetchSchools(page, limit, sortColumn, sortDirection)
//     }, [page, limit, sortColumn, sortDirection])

//     const fetchSchools = async (page, limit, sortColumn, sortDirection) => {
//         try {
//             const response = await getSchools(
//                 page,
//                 limit,
//                 sortColumn,
//                 sortDirection
//             )
//             const { schools, total } = response.data
//             setSchools(schools || [])
//             setTotal(total || 0)
//         } catch (error) {
//             console.error('Error fetching schools:', error)
//         }
//     }

//     const handleCreateSchool = async () => {
//         const errors = {}
//         if (newSchool.name.trim() === '') errors.name = 'Name is required'
//         if (newSchool.address.trim() === '')
//             errors.address = 'Address is required'
//         setNewSchoolErrors(errors)

//         if (Object.keys(errors).length > 0) return

//         try {
//             await createSchool(newSchool)
//             fetchSchools(page, limit, sortColumn, sortDirection)
//             setShowCreateForm(false)
//             setNewSchool({ name: '', address: '' })
//         } catch (error) {
//             console.error('Error creating school:', error)
//         }
//     }

//     const handleDeleteSchool = (schoolId) => {
//         setSelectedSchoolId(schoolId)
//         setConfirmOpen(true)
//     }

//     const confirmDeleteSchool = async () => {
//         try {
//             await deleteSchool(selectedSchoolId)
//             fetchSchools(page, limit, sortColumn, sortDirection)
//             setConfirmOpen(false)
//             setSelectedSchoolId(null)
//         } catch (error) {
//             console.error('Error deleting school:', error)
//         }
//     }

//     const handleEditSchool = async () => {
//         const errors = {}
//         if (editSchoolData.name.trim() === '') errors.name = 'Name is required'
//         if (editSchoolData.address.trim() === '')
//             errors.address = 'Address is required'
//         setEditSchoolErrors(errors)

//         if (Object.keys(errors).length > 0) return

//         try {
//             await updateSchool(editSchoolData.id, editSchoolData)
//             fetchSchools(page, limit, sortColumn, sortDirection)
//             setShowEditModal(false)
//         } catch (error) {
//             console.error('Error updating school:', error)
//         }
//     }

//     const openEditModal = (school) => {
//         setEditSchoolData({
//             id: school.id,
//             name: school.name,
//             address: school.address,
//         })
//         setShowEditModal(true)
//     }

//     const handleChangePage = (event, value) => {
//         setPage(value)
//     }

//     // Сортировка учителей
//     const handleSortRequest = (column) => {
//         const isAsc = sortColumn === column && sortDirection === 'asc'
//         setSortDirection(isAsc ? 'desc' : 'asc')
//         setSortColumn(column)
//     }

//     const handleNewSchoolChange = (e, field) => {
//         setNewSchool({ ...newSchool, [field]: e.target.value })
//         if (e.target.value.trim() !== '') {
//             setNewSchoolErrors({ ...newSchoolErrors, [field]: '' })
//         }
//     }

//     const handleEditSchoolChange = (e, field) => {
//         setEditSchoolData({ ...editSchoolData, [field]: e.target.value })
//         if (e.target.value.trim() !== '') {
//             setEditSchoolErrors({ ...editSchoolErrors, [field]: '' })
//         }
//     }

//     return (
//         <div>
//             <Typography variant="h4" gutterBottom>
//                 Schools
//             </Typography>
//             <TableContainer component={Paper}>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>ID</TableCell>
//                             <TableCell
//                                 sortDirection={
//                                     sortColumn === 'name'
//                                         ? sortDirection
//                                         : false
//                                 }
//                             >
//                                 <TableSortLabel
//                                     active={sortColumn === 'name'}
//                                     direction={
//                                         sortColumn === 'name'
//                                             ? sortDirection
//                                             : 'asc'
//                                     }
//                                     onClick={() => handleSortRequest('name')}
//                                 >
//                                     Name
//                                 </TableSortLabel>
//                             </TableCell>
//                             <TableCell
//                                 sortDirection={
//                                     sortColumn === 'address'
//                                         ? sortDirection
//                                         : false
//                                 }
//                             >
//                                 <TableSortLabel
//                                     active={sortColumn === 'address'}
//                                     direction={
//                                         sortColumn === 'address'
//                                             ? sortDirection
//                                             : 'asc'
//                                     }
//                                     onClick={() => handleSortRequest('address')}
//                                 >
//                                     Address
//                                 </TableSortLabel>
//                             </TableCell>
//                             <TableCell>Actions</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {Array.isArray(schools) &&
//                             schools.map((school) => (
//                                 <TableRow key={school.id}>
//                                     <TableCell>{school.id}</TableCell>
//                                     <TableCell>{school.name}</TableCell>
//                                     <TableCell>{school.address}</TableCell>
//                                     <TableCell>
//                                         <Button
//                                             variant="contained"
//                                             color="secondary"
//                                             onClick={() =>
//                                                 handleDeleteSchool(school.id)
//                                             }
//                                             style={{ marginRight: '10px' }}
//                                         >
//                                             Delete
//                                         </Button>
//                                         <Button
//                                             variant="contained"
//                                             color="primary"
//                                             onClick={() =>
//                                                 openEditModal(school)
//                                             }
//                                         >
//                                             Edit
//                                         </Button>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//             <PaginationComponent
//                 totalItems={total}
//                 itemsPerPage={limit}
//                 currentPage={page}
//                 onPageChange={handleChangePage}
//             />
//             <Box mt={2}>
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => setShowCreateForm(true)}
//                 >
//                     Create School
//                 </Button>
//             </Box>
//             {showCreateForm && (
//                 <Box mt={2}>
//                     <Typography variant="h6" gutterBottom>
//                         Create New School
//                     </Typography>
//                     <TextField
//                         label="Name"
//                         value={newSchool.name}
//                         onChange={(e) => handleNewSchoolChange(e, 'name')}
//                         fullWidth
//                         margin="normal"
//                         required={true}
//                         inputProps={{ maxLength: 20 }}
//                         error={newSchoolErrors.name !== ''}
//                         helperText={newSchoolErrors.name}
//                     />
//                     <TextField
//                         label="Address"
//                         value={newSchool.address}
//                         onChange={(e) => handleNewSchoolChange(e, 'address')}
//                         fullWidth
//                         margin="normal"
//                         required={true}
//                         inputProps={{ maxLength: 40 }}
//                         error={newSchoolErrors.address !== ''}
//                         helperText={newSchoolErrors.address}
//                     />
//                     <Box mt={2}>
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             onClick={handleCreateSchool}
//                         >
//                             Save
//                         </Button>
//                         <Button
//                             variant="contained"
//                             color="secondary"
//                             onClick={() => setShowCreateForm(false)}
//                             style={{ marginLeft: '10px' }}
//                         >
//                             Cancel
//                         </Button>
//                     </Box>
//                 </Box>
//             )}
//             <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
//                 <Box
//                     sx={{
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transform: 'translate(-50%, -50%)',
//                         width: 400,
//                         bgcolor: 'background.paper',
//                         boxShadow: 24,
//                         p: 4,
//                     }}
//                 >
//                     <Typography variant="h6" gutterBottom>
//                         Edit School
//                     </Typography>
//                     <TextField
//                         label="Name"
//                         value={editSchoolData.name}
//                         onChange={(e) => handleEditSchoolChange(e, 'name')}
//                         fullWidth
//                         margin="normal"
//                         inputProps={{ maxLength: 20 }}
//                         error={editSchoolErrors.name !== ''}
//                         helperText={editSchoolErrors.name}
//                     />
//                     <TextField
//                         label="Address"
//                         value={editSchoolData.address}
//                         onChange={(e) => handleEditSchoolChange(e, 'address')}
//                         fullWidth
//                         margin="normal"
//                         inputProps={{ maxLength: 40 }}
//                         error={editSchoolErrors.address !== ''}
//                         helperText={editSchoolErrors.address}
//                     />
//                     <Box mt={2}>
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             onClick={handleEditSchool}
//                         >
//                             Save
//                         </Button>
//                         <Button
//                             variant="contained"
//                             color="secondary"
//                             onClick={() => setShowEditModal(false)}
//                             style={{ marginLeft: '10px' }}
//                         >
//                             Cancel
//                         </Button>
//                     </Box>
//                 </Box>
//             </Modal>
//             <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
//                 <DialogTitle>Confirm Deletion</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                         Are you sure you want to delete this school?
//                     </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button
//                         onClick={() => setConfirmOpen(false)}
//                         color="primary"
//                     >
//                         Cancel
//                     </Button>
//                     <Button onClick={confirmDeleteSchool} color="secondary">
//                         Delete
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     )
// }

// export default SchoolTable
