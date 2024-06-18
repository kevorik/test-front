import axios from 'axios';

const API_URL = 'http://localhost:3000';

//GET
export const getSchools = () => axios.get(`${API_URL}/schools`);
export const getTeachers = () => axios.get(`${API_URL}/teachers`);
export const getStudents = () => axios.get(`${API_URL}/students`);
export const getClasses = () => axios.get(`${API_URL}/classes`);
export const getSubjects = () => axios.get(`${API_URL}/subjects`);

//POST
export const createSchool = (school) => axios.post(`${API_URL}/schools`, school);
export const createTeacher = (teacher) => axios.post(`${API_URL}/teachers`, teacher);
export const createStudent = (student) => axios.post(`${API_URL}/students`, student);
export const createClass = (classData) => axios.post(`${API_URL}/classes`, classData);
export const createSubject = (subject) => axios.post(`${API_URL}/subjects`, subject);

//DELETE
export const deleteSchool = (schoolId) => axios.delete(`${API_URL}/schools/${schoolId}`);
export const deleteClass = (classId) => axios.delete(`${API_URL}/classes/${classId}`);
export const deleteStudent = (studentId) => axios.delete(`${API_URL}/students/${studentId}`);
export const deleteSubject = (subjectId) => axios.delete(`${API_URL}/subjects/${subjectId}`);
export const deleteTeacher = (teacherId) => axios.delete(`${API_URL}/teachers/${teacherId}`);

//PUT
export const updateSchool = (schoolId, updatedSchool) => {
    const { id, ...data } = updatedSchool;
    return axios.put(`${API_URL}/schools/${schoolId}`, data);
};

export const updateClass = (classId, updatedClass) => {
    const { id, ...data } = updatedClass;
    return axios.put(`${API_URL}/classes/${classId}`, data);
};

export const updateStudent = (studentId, updatedStudent) => {
    const { id, ...data } = updatedStudent;
    return axios.put(`${API_URL}/students/${studentId}`, data);
};

export const updateSubject = (subjectId, updatedSubject) => {
    const { id, ...data } = updatedSubject;
    return axios.put(`${API_URL}/subjects/${subjectId}`, data);
};

export const updateTeacher = (teacherId, updatedTeacher) => {
    const { id, ...data } = updatedTeacher;
    return axios.put(`${API_URL}/teachers/${teacherId}`, data);
  };
  