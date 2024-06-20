import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SchoolTable from './SchoolTable'
import ClassTable from './ClassTable'
import StudentTable from './StudentTable'
import SubjectTable from './SubjectTable'
import TeacherTable from './TeacherTable'
import Sidebar from './Sidebar'

const Dashboard = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flexGrow: 1, padding: '24px' }}>
                <Routes>
                    <Route path="/schools" element={<SchoolTable />} />
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
