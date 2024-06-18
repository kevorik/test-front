import React, { useEffect, useState } from 'react';
import { getSchools, createSchool, deleteSchool, updateSchool } from '../services/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, TextField, Box, Modal, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const SchoolTable = () => {
  const [schools, setSchools] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSchoolData, setEditSchoolData] = useState({ id: '', name: '', address: '' });

  const [newSchool, setNewSchool] = useState({ name: '', address: '' });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await getSchools();
      setSchools(response.data);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const handleCreateSchool = async () => {
    try {
      await createSchool(newSchool);
      fetchSchools(); // Refresh the school list
      setShowCreateForm(false);
      setNewSchool({ name: '', address: '' }); // Reset the form fields
    } catch (error) {
      console.error('Error creating school:', error);
    }
  };

  const handleDeleteSchool = (schoolId) => {
    setSelectedSchoolId(schoolId);
    setConfirmOpen(true);
  };

  const confirmDeleteSchool = async () => {
    try {
      await deleteSchool(selectedSchoolId);
      fetchSchools(); // Refresh the school list after deletion
      setConfirmOpen(false);
      setSelectedSchoolId(null);
    } catch (error) {
      console.error('Error deleting school:', error);
    }
  };

  const handleEditSchool = async () => {
    try {
      await updateSchool(editSchoolData.id, editSchoolData);
      fetchSchools(); // Refresh the school list
      setShowEditModal(false); // Close the modal after saving
    } catch (error) {
      console.error('Error updating school:', error);
    }
  };

  const openEditModal = (school) => {
    setEditSchoolData({ id: school.id, name: school.name, address: school.address });
    setShowEditModal(true);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Schools</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schools.map((school) => (
              <TableRow key={school.id}>
                <TableCell>{school.id}</TableCell>
                <TableCell>{school.name}</TableCell>
                <TableCell>{school.address}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteSchool(school.id)}
                    style={{ marginRight: '10px' }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openEditModal(school)}
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
        <Button variant="contained" color="primary" onClick={() => setShowCreateForm(true)}>
          Create School
        </Button>
      </Box>
      {showCreateForm && (
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>Create New School</Typography>
          <TextField
            label="Name"
            value={newSchool.name}
            onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            value={newSchool.address}
            onChange={(e) => setNewSchool({ ...newSchool, address: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleCreateSchool}>
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
          <Typography variant="h6" gutterBottom>Edit School</Typography>
          <TextField
            label="Name"
            value={editSchoolData.name}
            onChange={(e) => setEditSchoolData({ ...editSchoolData, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            value={editSchoolData.address}
            onChange={(e) => setEditSchoolData({ ...editSchoolData, address: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleEditSchool}>
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
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this school?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteSchool} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SchoolTable;
