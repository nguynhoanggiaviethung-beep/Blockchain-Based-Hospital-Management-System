import React, { useState } from 'react';
import axios from 'axios';

const RegisterPatientForm = () => {
  const [patientData, setPatientData] = useState({
    email: '',
    password: '',
    fullName: '',
    dob: '',
    gender: '',      
    phone: '',       
    address: '',
    citizenId: ''    
  });
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value });
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    try {
      // Gọi API thật của Backend
      const response = await axios.post(`http://localhost:5000/api/v1/auth/register-patient`, patientData);
      
      if (response.data.success) {
        setStatusMessage('Đăng ký tài khoản bệnh nhân thành công!');
      }
    } catch (error) {
      setStatusMessage(error.response?.data?.message || 'Lỗi kết nối hệ thống Backend.');
    }
  };

  return (
    <div className="register-container" style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>ĐĂNG KÝ BỆNH NHÂN MỚI</h3>
      <form onSubmit={handleSubmitRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Email:</label>
          <input type="email" name="email" placeholder="Nhập địa chỉ email" onChange={handleChange} required style={{ padding: '8px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Mật khẩu:</label>
          <input type="password" name="password" placeholder="Nhập mật khẩu" onChange={handleChange} required style={{ padding: '8px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Họ và Tên:</label>
          <input type="text" name="fullName" placeholder="Nhập đầy đủ họ và tên" onChange={handleChange} required style={{ padding: '8px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Ngày sinh:</label>
          <input type="date" name="dob" onChange={handleChange} required style={{ padding: '8px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Giới tính:</label>
          <select name="gender" onChange={handleChange} required defaultValue="" style={{ padding: '8px' }}>
            <option value="" disabled>-- Chọn giới tính --</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Số điện thoại:</label>
          <input type="tel" name="phone" placeholder="Nhập số điện thoại" onChange={handleChange} required style={{ padding: '8px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Số CCCD/CMND:</label>
          <input type="text" name="citizenId" placeholder="Nhập số căn cước" onChange={handleChange} required style={{ padding: '8px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Địa chỉ:</label>
          <input type="text" name="address" placeholder="Nhập địa chỉ cụ thể" onChange={handleChange} required style={{ padding: '8px' }} />
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
          Đăng ký ngay
        </button>
        {statusMessage && <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{statusMessage}</p>}
      </form>
    </div>
  );
};

export default RegisterPatientForm;