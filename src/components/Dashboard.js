import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SchoolPage from './school/SchoolPage'
import ClassTable from './ClassTable'
import StudentTable from './StudentTable'
import SubjectTable from './SubjectTable'
import TeacherTable from './TeacherTable'
import Sidebar from './Sidebar'
import { useAuth } from '../components/AuthContext'

const Dashboard = () => {
    const { handleLogout } = useAuth()

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flexGrow: 1, padding: '24px' }}>
                <button onClick={handleLogout}>Logout</button>
                <Routes>
                    <Route path="/schools" element={<SchoolPage />} />
                    <Route path="/classes" element={<ClassTable />} />
                    <Route path="/students" element={<StudentTable />} />
                    <Route path="/subjects" element={<SubjectTable />} />
                    <Route path="/teachers" element={<TeacherTable />} />
                </Routes>
            </div>
        </div>
    )
}

export default Dashboard
