import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DoctorExamination = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  // State lưu thông tin bệnh nhân trả về từ API
  const [patientData, setPatientData] = useState(null);
  
  // State lưu form nhập liệu của Bác sĩ (Khớp 100% với lệnh ví dụ của nhóm trưởng)
  const [doctorInput, setDoctorInput] = useState({
    chanDoanChuyenMon: '',
    huongDieuTri: ''
  });

  // Gọi API lấy dữ liệu ban đầu khi vừa vào trang
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`/api/patients/${patientId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const result = await response.json();
        
        if (result.success || result._id) {
          const data = result.data || result;
          setPatientData(data);
          
          // Nếu bác sĩ đã từng nhập trước đó, điền lại vào form
          setDoctorInput({
            chanDoanChuyenMon: data.chanDoanChuyenMon || '',
            huongDieuTri: data.huongDieuTri || ''
          });
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu bệnh nhân:", error);
      }
    };
    if (patientId) fetchPatientData();
  }, [patientId]);

  // Xử lý gửi API cập nhật hồ sơ
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/medical-records/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        // Đẩy đúng cấu trúc JSON nhóm trưởng yêu cầu
        body: JSON.stringify({
          chanDoanChuyenMon: doctorInput.chanDoanChuyenMon,
          huongDieuTri: doctorInput.huongDieuTri
        })
      });
      
      const result = await response.json();
      
      // Xử lý response trả về theo đúng định dạng
      if (result.success) {
        alert(result.message); // Hiển thị: "Bác sĩ cập nhật kết quả khám chuyên môn thành công!"
        setPatientData(result.data); // Cập nhật lại toàn bộ hồ sơ bằng data trả về
      } else {
        alert("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    }
  };

  if (!patientData) return <div className="p-8 text-center text-blue-600 font-medium">Đang tải hồ sơ bệnh án...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto bg-slate-50 min-h-screen">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Hồ Sơ Khám Bệnh Chi Tiết</h2>
        <button 
          onClick={() => navigate(-1)} 
          className="px-4 py-2 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-50 font-medium text-slate-700 transition"
        >
          ← Quay lại danh sách
        </button>
      </div>

      {/* BLOCK 1: PHẦN BỆNH NHÂN TỰ CẬP NHẬT (Read-only) - Tone màu trung tính */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border-l-4 border-slate-400">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📋</span>
          <h3 className="text-lg font-bold text-slate-700 uppercase">Thông tin bệnh nhân khai báo</h3>
        </div>
        
        {/* Thông tin hành chính cơ bản */}
        <div className="flex gap-6 mb-4 pb-4 border-b border-slate-200 text-sm text-slate-600">
          <p><strong>Họ tên:</strong> <span className="text-slate-900 font-medium">{patientData.fullName}</span></p>
          <p><strong>Ngày sinh:</strong> {patientData.dob ? new Date(patientData.dob).toLocaleDateString('vi-VN') : '---'}</p>
          <p><strong>SĐT:</strong> {patientData.phone}</p>
          <p><strong>CCCD:</strong> {patientData.citizenId}</p>
        </div>

        {/* Thông tin lâm sàng (từ response trả về) */}
        <div className="grid grid-cols-2 gap-4 text-slate-800">
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <p className="text-sm text-slate-500 font-medium mb-1">Triệu chứng hiện tại</p>
            <p className="font-semibold text-red-600">{patientData.trieuChung || 'Không ghi nhận'}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <p className="text-sm text-slate-500 font-medium mb-1">Tiền sử bệnh án</p>
            <p className="font-medium">{patientData.tienSuBenh || 'Không có'}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <p className="text-sm text-slate-500 font-medium mb-1">Dị ứng</p>
            <p className="font-medium text-orange-600">{patientData.diUng || 'Không dị ứng'}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <p className="text-sm text-slate-500 font-medium mb-1">Nhóm máu</p>
            <p className="font-bold text-blue-600">{patientData.nhomMau || 'Chưa rõ'}</p>
          </div>
          <div className="col-span-2 bg-slate-100 p-3 rounded border border-slate-200 mt-2">
            <p className="text-sm text-slate-600 font-medium mb-1">Ghi chú thêm từ bệnh nhân</p>
            <p className="text-slate-700">{patientData.ghiChu || 'Không có ghi chú'}</p>
          </div>
        </div>
      </div>

      {/* BLOCK 2: PHẦN BÁC SĨ CHẨN ĐOÁN (Form thao tác) - Tone màu Xanh dương chủ đạo */}
      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600 ring-1 ring-blue-50">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🩺</span>
          <h3 className="text-lg font-bold text-blue-700 uppercase">Khu vực bác sĩ chuyên môn</h3>
        </div>
        
        <form onSubmit={handleUpdate} className="flex flex-col gap-5">
          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Chẩn đoán chuyên môn <span className="text-red-500">*</span>
            </label>
            <textarea 
              className="w-full border border-slate-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all shadow-sm" 
              rows="2" 
              required
              value={doctorInput.chanDoanChuyenMon}
              onChange={(e) => setDoctorInput({...doctorInput, chanDoanChuyenMon: e.target.value})}
              placeholder="Ví dụ: Viêm họng cấp tính..."
            />
          </div>
          
          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Hướng điều trị & Dặn dò <span className="text-red-500">*</span>
            </label>
            <textarea 
              className="w-full border border-slate-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all shadow-sm" 
              rows="3" 
              required
              value={doctorInput.huongDieuTri}
              onChange={(e) => setDoctorInput({...doctorInput, huongDieuTri: e.target.value})}
              placeholder="Ví dụ: Uống thuốc đúng giờ, súc miệng nước muối..."
            />
          </div>
          
          <div className="flex justify-end mt-2">
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-8 py-3 rounded-md font-bold text-lg hover:bg-blue-700 active:scale-95 transition-transform shadow-md"
            >
              Lưu & Cập nhật Hồ Sơ
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default DoctorExamination;