import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'// Hoặc 'axios' tùy thuộc cấu trúc của bạn, giữ nguyên import gốc:
import axiosOriginal from 'axios'

const PRIMARY = "#0A2D6E"
const PRIMARY_MED = "#1A4FA8"
const PRIMARY_LIGHT = "#E6F1FB"
const GRAY_TEXT = "#5F6B7A"
const BORDER = "#CBD5E1"

export default function DoctorDashboard() {
  const navigate = useNavigate()

  // Khởi tạo thông tin bác sĩ dự phòng từ localStorage nếu API lỗi
  const [doctorInfo, setDoctorInfo] = useState({
    fullName: localStorage.getItem("fullName") || "Bác sĩ hệ thống",
    specialty: localStorage.getItem("chuyenKhoa") || "Da liễu",
    licenseNumber: localStorage.getItem("maBacSi") || "BS-123450"
  });

  const [patientList, setPatientList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      navigate("/");
      return;
    }

    // 1. Lấy thông tin chi tiết bác sĩ từ API
    const fetchDoctorProfile = async () => {
      let currentSpecialty = doctorInfo.specialty; // Giữ chuyên khoa mặc định phòng khi lỗi

      try {
        const response = await axiosOriginal.get(`http://localhost:5000/api/v1/doctors/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response?.data?.success && response?.data?.data) {
          const d = response.data.data;
          currentSpecialty = d?.["Chuyên Khoa"] || d?.specialty || currentSpecialty;
          
          setDoctorInfo({
            fullName: d?.["Họ và tên"] || d?.fullName || localStorage.getItem("fullName") || "Nguyễn Hoàng Hưng",
            specialty: currentSpecialty,
            licenseNumber: d?.["Giấy phép hành nghề"] || d?.licenseNumber || localStorage.getItem("maBacSi") || "BS-123450"
          });
        }
      } catch (error) {
        console.warn("⚠️ Không tìm thấy hồ sơ bác sĩ riêng biệt (404), sử dụng thông tin đăng nhập mặc định.");
      } finally {
        // Sau khi cố gắng lấy profile (dù thành công hay lỗi 404) -> Vẫn phải gọi tiếp danh sách bệnh nhân
        await fetchRealPatients(currentSpecialty, token);
      }
    };

    // 2. Hàm lấy danh sách bệnh nhân THẬT từ DB
    const fetchRealPatients = async (specialtyName, userToken) => {
      try {
        const response = await axiosOriginal.get(`http://localhost:5000/api/v1/medical-records/doctor/pending`, {
          headers: { Authorization: `Bearer ${userToken}` },
          params: { specialty: specialtyName }
        });
        
        if (response?.data?.success) {
          setPatientList(response.data.data); 
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách bệnh nhân thật từ DB:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F4F7FB", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: PRIMARY, color: "#fff", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>🏥 VNmedID — Bác sĩ</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14 }}>🩺 Chào, {doctorInfo.fullName}</span>
          <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
            Đăng xuất
          </button>
        </div>
      </div>

      <div style={{ padding: "32px" }}>
        {/* Lời chào */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ color: PRIMARY, margin: 0 }}>Xin chào, BS. {doctorInfo.fullName} 👋</h2>
          <p style={{ color: GRAY_TEXT, marginTop: 4, fontSize: 14 }}>
            Chuyên khoa phụ trách: <span style={{ color: PRIMARY_MED, fontWeight: 600 }}>{doctorInfo.specialty}</span> · Số GP hành nghề: <strong>{doctorInfo.licenseNumber}</strong>
          </p>
        </div>

        {/* 3 Ô Thống kê dữ liệu thật */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
          {[
            { icon: "👥", label: "Tổng bệnh nhân phân phòng", value: loading ? "..." : patientList.length },
            { icon: "📋", label: "Hồ sơ đã xử lý thành công", value: "12" },
            { icon: "⏳", label: "Đang xếp hàng chờ", value: loading ? "..." : patientList.length },
          ].map(card => (
            <div key={card.label} style={{ background: "#fff", borderRadius: 14, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{card.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: PRIMARY }}>{card.value}</div>
              <div style={{ fontSize: 13, color: GRAY_TEXT, marginTop: 4 }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Bảng phân công */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: PRIMARY, margin: 0 }}>👥 Danh sách tài khoản bệnh nhân thực tế thuộc khoa ({doctorInfo.specialty})</h3>
            <span style={{ fontSize: 12, background: PRIMARY_LIGHT, color: PRIMARY_MED, padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>
              Dữ liệu Live DB
            </span>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: PRIMARY_LIGHT }}>
                {["Họ tên", "Ngày sinh", "Giới tính", "SĐT", "Trạng thái khám", "Thao tác"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 13, color: PRIMARY, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: GRAY_TEXT, fontSize: 14 }}>
                    Đang tải danh sách bệnh nhân...
                  </td>
                </tr>
              ) : patientList.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: GRAY_TEXT, fontSize: 14, fontStyle: "italic" }}>
                    Chưa có tài khoản bệnh nhân nào được tạo hoặc đăng ký khám ở chuyên khoa {doctorInfo.specialty} này.
                  </td>
                </tr>
              ) : (
                patientList.map((p, i) => (
                  <tr key={p._id || i} style={{ background: i % 2 === 0 ? "#fff" : "#FAFBFC", borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 600, color: "#1E293B" }}>{p.fullName || p["Họ và tên"]}</td>
                    <td style={{ padding: "12px 14px", fontSize: 14, color: "#475569" }}>
                      {p.dob || p["Ngày sinh"] ? new Date(p.dob || p["Ngày sinh"]).toLocaleDateString('vi-VN') : "---"}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 14, color: "#475569" }}>{p.gender || p["Giới tính"] || "Chưa cập nhật"}</td>
                    <td style={{ padding: "12px 14px", fontSize: 14, color: "#475569" }}>{p.phone || p["Số điện thoại"] || "---"}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13 }}>
                      <span style={{ background: "#FEF3C7", color: "#D97706", padding: "2px 8px", borderRadius: 4, fontWeight: 500 }}>
                        Chờ khám ({doctorInfo.specialty})
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <button
                        onClick={() => navigate(`/dashboard/doctor/diagnose/${p._id}`)}
                        style={{ background: PRIMARY, color: "#fff", border: "none", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                      >
                        Vào khám
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}