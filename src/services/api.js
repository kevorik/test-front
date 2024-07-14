import axios from 'axios'

const API_URL = 'http://localhost:3000'

//GET
export const getSchools = (page, limit, sortColumn, sortDirection) => {
    return axios.get(`${API_URL}/schools`, {
        params: { page, limit, sortColumn, sortDirection },
    })
}

export const getTeachers = (page, limit, sortColumn, sortDirection) => {
    return axios.get(`${API_URL}/teachers`, {
        params: { page, limit, sortColumn, sortDirection },
    })
}

export const getStudents = (page, limit, sortColumn, sortDirection) => {
    return axios.get(`${API_URL}/students`, {
        params: { page, limit, sortColumn, sortDirection },
    })
}

export const getClasses = (page, limit) => {
    return axios.get(`${API_URL}/classes`, {
        params: { page, limit },
    })
}

export const getSubjects = (page, limit, sortColumn, sortDirection) => {
    return axios.get(`${API_URL}/subjects`, {
        params: { page, limit, sortColumn, sortDirection },
    })
}

export const getLevels = () => {
    return axios.get(`${API_URL}/levels`)
}

//POST
export const createSchool = (school) => axios.post(`${API_URL}/schools`, school)
export const createTeacher = (teacher) =>
    axios.post(`${API_URL}/teachers`, teacher)
export const createStudent = (student) =>
    axios.post(`${API_URL}/students`, student)
export const createClass = (classData) =>
    axios.post(`${API_URL}/classes`, classData)
export const createSubject = (subject) =>
    axios.post(`${API_URL}/subjects`, subject)

//DELETE
export const deleteSchool = (schoolId) =>
    axios.delete(`${API_URL}/schools/${schoolId}`)
export const deleteClass = (classId) =>
    axios.delete(`${API_URL}/classes/${classId}`)
export const deleteStudent = (studentId) =>
    axios.delete(`${API_URL}/students/${studentId}`)
export const deleteSubject = (subjectId) =>
    axios.delete(`${API_URL}/subjects/${subjectId}`)
export const deleteTeacher = (teacherId) =>
    axios.delete(`${API_URL}/teachers/${teacherId}`)

//PUT
export const updateSchool = (schoolId, updatedSchool) => {
    const { id, ...data } = updatedSchool
    return axios.put(`${API_URL}/schools/${schoolId}`, data)
}

export const updateClass = (classId, updatedClass) => {
    const { id, ...data } = updatedClass
    return axios.put(`${API_URL}/classes/${classId}`, data)
}

export const updateStudent = (studentId, updatedStudent) => {
    const { id, ...data } = updatedStudent
    return axios.put(`${API_URL}/students/${studentId}`, data)
}

export const updateSubject = (subjectId, updatedSubject) => {
    const { id, ...data } = updatedSubject
    return axios.put(`${API_URL}/subjects/${subjectId}`, data)
}

export const updateTeacher = (teacherId, updatedTeacher) => {
    const { id, ...data } = updatedTeacher
    return axios.put(`${API_URL}/teachers/${teacherId}`, data)
}

//AUTH

export const login = async (email, password) => {
    return axios.post(`${API_URL}/auth/login`, { email, password })
}

export const register = async (email, password, name) => {
    return axios.post(`${API_URL}/auth/register`, { email, password, name })
}

export const logout = () => {
    return axios.post(`${API_URL}/auth/logout`, { withCredentials: true })
}
