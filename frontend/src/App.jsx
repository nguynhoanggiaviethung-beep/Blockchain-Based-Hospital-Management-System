import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import PatientDashboard from './pages/PatientDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import AdminDashboard from './pages/AdminDashboard'
// 1. Thêm dòng import này
import DoctorExamination from './pages/DoctorExamination'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/patient" element={<PatientDashboard />} />
        <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
        
        {/* 2. Thêm Route này để liên kết với nút bấm bên trang Doctor */}
        <Route path="/doctor/examine/:patientId" element={<DoctorExamination />} />
        
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App