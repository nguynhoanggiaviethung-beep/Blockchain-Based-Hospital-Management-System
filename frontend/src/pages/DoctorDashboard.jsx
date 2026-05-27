import { useNavigate } from 'react-router-dom'
import { mockGetDoctorResponse, mockPatientList } from '../mock/mockData'

const PRIMARY = "#0A2D6E"
const PRIMARY_LIGHT = "#E6F1FB"

export default function DoctorDashboard() {
  const navigate = useNavigate()
  const doctor = mockGetDoctorResponse.data

  return (
    <div style={{ minHeight: "100vh", background: "#F4F7FB", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ background: PRIMARY, color: "#fff", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>🏥 VNmedID — Bác sĩ</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14 }}>🩺 {doctor.fullName}</span>
          <button onClick={() => navigate("/")} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
            Đăng xuất
          </button>
        </div>
      </div>

      <div style={{ padding: "32px" }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ color: PRIMARY, margin: 0 }}>Xin chào, BS. {doctor.fullName} 👋</h2>
          <p style={{ color: "#5F6B7A", marginTop: 4 }}>Chuyên khoa: {doctor.specialty} · Mã: {doctor.licenseNumber}</p>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
          {[
            { icon: "👥", label: "Bệnh nhân hôm nay", value: "5" },
            { icon: "📋", label: "Hồ sơ đã tạo", value: "12" },
            { icon: "⏳", label: "Chờ khám", value: "2" },
          ].map(card => (
            <div key={card.label} style={{ background: "#fff", borderRadius: 14, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{card.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: PRIMARY }}>{card.value}</div>
              <div style={{ fontSize: 13, color: "#5F6B7A", marginTop: 4 }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Danh sách bệnh nhân */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <h3 style={{ color: PRIMARY, marginTop: 0 }}>👥 Danh sách bệnh nhân được phân công</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: PRIMARY_LIGHT }}>
                {["Họ tên", "Ngày sinh", "Giới tính", "SĐT"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 13, color: PRIMARY }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockPatientList.map((p, i) => (
                <tr key={p._id} style={{ background: i % 2 === 0 ? "#fff" : "#FAFBFC" }}>
                  <td style={{ padding: "10px 14px", fontSize: 14 }}>{p.fullName}</td>
                  <td style={{ padding: "10px 14px", fontSize: 14 }}>{p.dob}</td>
                  <td style={{ padding: "10px 14px", fontSize: 14 }}>{p.gender}</td>
                  <td style={{ padding: "10px 14px", fontSize: 14 }}>{p.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}