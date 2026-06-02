import { useNavigate } from 'react-router-dom'
import { mockPatientList, mockDoctorList } from '../mock/mockData'

const PRIMARY = "#0A2D6E"
const PRIMARY_LIGHT = "#E6F1FB"

export default function AdminDashboard() {
  const navigate = useNavigate()

  const fullName = localStorage.getItem("fullName") || "Quản trị viên"

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F4F7FB", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: PRIMARY, color: "#fff", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>🏥 VNmedID — Admin</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14 }}>🔑 {fullName}</span>
          <button
            onClick={handleLogout}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <div style={{ padding: "32px" }}>
        {/* Tiêu đề */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ color: PRIMARY, margin: 0 }}>Xin chào, {fullName} 🔑</h2>
          <p style={{ color: "#5F6B7A", marginTop: 4 }}>Quản lý toàn bộ người dùng và phân quyền</p>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
          {[
            { icon: "👥", label: "Tổng bệnh nhân", value: mockPatientList.length },
            { icon: "🩺", label: "Tổng bác sĩ", value: mockDoctorList.length },
            { icon: "📋", label: "Lượt khám hôm nay", value: "7" },
            { icon: "🔗", label: "Giao dịch blockchain", value: "24" },
          ].map(card => (
            <div key={card.label} style={{ background: "#fff", borderRadius: 14, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{card.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: PRIMARY }}>{card.value}</div>
              <div style={{ fontSize: 13, color: "#5F6B7A", marginTop: 4 }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* 2 bảng cạnh nhau */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Danh sách bác sĩ */}
          <div style={{ background: "#fff", borderRadius: 14, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <h3 style={{ color: PRIMARY, marginTop: 0 }}>🩺 Danh sách bác sĩ</h3>
            {mockDoctorList.map((d, i) => (
              <div key={d._id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < mockDoctorList.length - 1 ? "1px solid #F0F0F0" : "none" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{d.fullName}</div>
                  <div style={{ fontSize: 12, color: "#5F6B7A" }}>{d.specialty}</div>
                </div>
                <span style={{ background: PRIMARY_LIGHT, color: PRIMARY, fontSize: 11, padding: "3px 10px", borderRadius: 20, alignSelf: "center" }}>{d.licenseNumber}</span>
              </div>
            ))}
          </div>

          {/* Danh sách bệnh nhân */}
          <div style={{ background: "#fff", borderRadius: 14, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <h3 style={{ color: PRIMARY, marginTop: 0 }}>👥 Danh sách bệnh nhân</h3>
            {mockPatientList.map((p, i) => (
              <div key={p._id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < mockPatientList.length - 1 ? "1px solid #F0F0F0" : "none" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.fullName}</div>
                  <div style={{ fontSize: 12, color: "#5F6B7A" }}>{p.phone}</div>
                </div>
                <span style={{ background: "#E6F9F0", color: "#0F6E56", fontSize: 11, padding: "3px 10px", borderRadius: 20, alignSelf: "center" }}>{p.gender}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}