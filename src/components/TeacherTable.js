import React, { useEffect, useState } from 'react';
import { getTeachers, createTeacher, getSubjects, getSchools, deleteTeacher, updateTeacher } from '../services/api';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, TextField, Box,
  MenuItem, Select, InputLabel, FormControl, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Checkbox
} from '@mui/material';

const TeacherTable = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [schools, setSchools] = useState([]);
  const [showCreateTeacherForm, setShowCreateTeacherForm] = useState(false);
  const [showEditTeacherForm, setShowEditTeacherForm] = useState(false);
  const [showSubjectDialog, setShowSubjectDialog] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [newTeacher, setNewTeacher] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    subjects: [],
    school: { id: '' }
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  useEffect(() => {
    getTeachers().then(response => setTeachers(response.data));
    getSubjects().then(response => setSubjects(response.data));
    getSchools().then(response => setSchools(response.data));
  }, []);

  const handleCreateTeacher = async () => {
    try {
      const response = await createTeacher({
        first_name: newTeacher.first_name,
        last_name: newTeacher.last_name,
        middle_name: newTeacher.middle_name,
        subjects: newTeacher.subjects.map(subjectId => ({ id: subjectId })),
        school: { id: newTeacher.school.id }
      });

      if (response.status === 201) {
        getTeachers().then(response => setTeachers(response.data));
        setShowCreateTeacherForm(false);
        setNewTeacher({ first_name: '', last_name: '', middle_name: '', subjects: [], school: { id: '' } }); 
      }
    } catch (error) {
      console.error('Error creating teacher:', error);
    }
  };

  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setNewTeacher({
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      middle_name: teacher.middle_name,
      subjects: teacher.subjects.map(subject => subject.id),
      school: { id: teacher.school.id }
    });
    setShowEditTeacherForm(true);
  };

  const handleUpdateTeacher = async () => {
    try {
      const updatedTeacher = {
        id: selectedTeacher.id,
        first_name: newTeacher.first_name,
        last_name: newTeacher.last_name,
        middle_name: newTeacher.middle_name,
        subjects: newTeacher.subjects.map(subjectId => ({ id: subjectId })),
        school: { id: newTeacher.school.id }
      };
      await updateTeacher(selectedTeacher.id, updatedTeacher);
      getTeachers().then(response => setTeachers(response.data)); // Refresh the teacher list
      setShowEditTeacherForm(false);
      setSelectedTeacher(null);
    } catch (error) {
      console.error('Error updating teacher:', error);
    }
  };

  const handleSubjectDialogOpen = () => {
    setSelectedSubjects(newTeacher.subjects);
    setShowSubjectDialog(true);
  };

  const handleSubjectDialogClose = () => {
    setShowSubjectDialog(false);
  };

  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects((prevSelectedSubjects) =>
      prevSelectedSubjects.includes(subjectId)
        ? prevSelectedSubjects.filter((id) => id !== subjectId)
        : [...prevSelectedSubjects, subjectId]
    );
  };

  const handleSubjectDialogConfirm = () => {
    setNewTeacher((prevNewTeacher) => ({
      ...prevNewTeacher,
      subjects: selectedSubjects
    }));
    setShowSubjectDialog(false);
  };

  const handleDeleteTeacher = (teacherId) => {
    setSelectedTeacherId(teacherId);
    setConfirmOpen(true);
  };

  const confirmDeleteTeacher = async () => {
    try {
      await deleteTeacher(selectedTeacherId);
      setTeachers(prevTeachers => prevTeachers.filter(teacher => teacher.id !== selectedTeacherId));
      setConfirmOpen(false);
      setSelectedTeacherId(null);
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Teachers</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Middle Name</TableCell>
              <TableCell>Subjects</TableCell>
              <TableCell>School</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.id}</TableCell>
                <TableCell>{teacher.first_name}</TableCell>
                <TableCell>{teacher.last_name}</TableCell>
                <TableCell>{teacher.middle_name}</TableCell>
                <TableCell>
                  {teacher.subjects && teacher.subjects.length > 0 ? (
                    <ul>
                      {teacher.subjects.map(subject => (
                        <li key={subject.id}>{subject.name}</li>
                      ))}
                    </ul>
                  ) : 'N/A'}
                </TableCell>
                <TableCell>{teacher.school ? teacher.school.name : 'N/A'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteTeacher(teacher.id)}
                    style={{ marginRight: '10px' }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditTeacher(teacher)}
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
        <Button variant="contained" color="primary" onClick={() => setShowCreateTeacherForm(true)}>
          Create Teacher
        </Button>
      </Box>
      {showCreateTeacherForm && (
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>Create New Teacher</Typography>
          <TextField
            label="First Name"
            value={newTeacher.first_name}
            onChange={(e) => setNewTeacher({ ...newTeacher, first_name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            value={newTeacher.last_name}
            onChange={(e) => setNewTeacher({ ...newTeacher, last_name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Middle Name"
            value={newTeacher.middle_name}
            onChange={(e) => setNewTeacher({ ...newTeacher, middle_name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Button variant="outlined" onClick={handleSubjectDialogOpen}>
            Select Subjects
          </Button>
          <FormControl fullWidth margin="normal">
            <InputLabel id="schoolId-label">School</InputLabel>
            <Select
              labelId="schoolId-label"
              value={newTeacher.school.id}
              onChange={(e) => setNewTeacher({ ...newTeacher, school: { id: e.target.value } })}
            >
              {schools.map((school) => (
                <MenuItem key={school.id} value={school.id}>
                  {school.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedSubjects.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle1">Selected Subjects:</Typography>
              <ul>
                {selectedSubjects.map((subjectId) => {
                  const subject = subjects.find(subject => subject.id === subjectId);
                  return (
                    <li key={subjectId}>{subject ? subject.name : 'Unknown Subject'}</li>
                  );
                })}
              </ul>
            </Box>
          )}
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleCreateTeacher}>
              Save
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setShowCreateTeacherForm(false)} style={{ marginLeft: '10px' }}>
              Cancel
            </Button>
          </Box>
        </Box>
      )}

      <Dialog open={showEditTeacherForm} onClose={() => setShowEditTeacherForm(false)}>
        <DialogTitle>Edit Teacher</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            value={newTeacher.first_name}
            onChange={(e) => setNewTeacher({ ...newTeacher, first_name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            value={newTeacher.last_name}
            onChange={(e) => setNewTeacher({ ...newTeacher, last_name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Middle Name"
            value={newTeacher.middle_name}
            onChange={(e) => setNewTeacher({ ...newTeacher, middle_name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Button variant="outlined" onClick={handleSubjectDialogOpen}>
            Select Subjects
          </Button>
          <FormControl fullWidth margin="normal">
            <InputLabel id="schoolId-label">School</InputLabel>
            <Select
              labelId="schoolId-label"
              value={newTeacher.school.id}
              onChange={(e) => setNewTeacher({ ...newTeacher, school: { id: e.target.value } })}
            >
              {schools.map((school) => (
                <MenuItem key={school.id} value={school.id}>
                  {school.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedSubjects.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle1">Selected Subjects:</Typography>
              <ul>
                {selectedSubjects.map((subjectId) => {
                  const subject = subjects.find(subject => subject.id === subjectId);
                  return (
                    <li key={subjectId}>{subject ? subject.name : 'Unknown Subject'}</li>
                  );
                })}
              </ul>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditTeacherForm(false)} color="secondary">
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
              <ListItem key={subject.id} button onClick={() => handleSubjectToggle(subject.id)}>
                <Checkbox
                  checked={selectedSubjects.includes(subject.id)}
                />
                <ListItemText primary={subject.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubjectDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubjectDialogConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this teacher?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteTeacher} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TeacherTable;
