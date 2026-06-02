import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import PatientDashboard from './pages/PatientDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import AdminDashboard from './pages/AdminDashboard'
// 1. Thêm dòng import này
import DoctorExamination from './pages/DoctorExamination'

// 1. Tạo một Component bọc bảo vệ (Protected Route) để chặn người lạ
const ProtectedRoute = ({ children, allowedRoles }) => {
  // Lấy thông tin user/role đã lưu khi đăng nhập thành công từ localStorage
  const userRole = localStorage.getItem('userRole'); // ví dụ: 'patient', 'doctor', 'admin'

  if (!userRole) {
    // Nếu chưa đăng nhập, đá về trang Login
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Nếu đăng nhập rồi nhưng vào sai vai trò (ví dụ bệnh nhân đòi vào admin), đá về trang cũ hoặc trang lỗi
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang đăng nhập công khai */}
        <Route path="/" element={<Login />} />

        {/* Các trang dashboard cần được bảo vệ theo đúng phân quyền */}
        <Route 
          path="/dashboard/patient" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/doctor" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Nếu gõ tầm bậy đường dẫn, tự động đẩy về trang Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App