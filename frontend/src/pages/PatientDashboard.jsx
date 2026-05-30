import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import HealthProfilePanel from '../components/HealthProfilePanel'

const PRIMARY = "#0A2D6E"
const PRIMARY_LIGHT = "#E6F1FB"
const BLOOD_TYPES_COLOR = { "A+": "#FCA5A5", "A-": "#FCA5A5", "B+": "#93C5FD", "B-": "#93C5FD", "AB+": "#C4B5FD", "AB-": "#C4B5FD", "O+": "#6EE7B7", "O-": "#6EE7B7" }

export default function PatientDashboard() {
  const navigate = useNavigate()
  const fullName = localStorage.getItem("fullName") || "Bệnh nhân"
  const userId = localStorage.getItem("userId")
  const token = localStorage.getItem("token")

  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showHealthPanel, setShowHealthPanel] = useState(false)

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  const layThongTin = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/patients/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) setPatient(data.data)
    } catch (err) {
      console.log('Lỗi lấy thông tin bệnh nhân:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) layThongTin()
    else setLoading(false)
  }, [])

  // Sau khi đóng panel, fetch lại để cập nhật UI
  const handlePanelClose = () => {
    setShowHealthPanel(false)
    layThongTin()
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F4F7FB", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      {/* Navbar */}
      <div style={{ background: PRIMARY, color: "#fff", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>🏥 VNmedID — Bệnh nhân</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14 }}>👤 {fullName}</span>
          <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
            Đăng xuất
          </button>
        </div>
      </div>

      <div style={{ padding: "32px" }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ color: PRIMARY, margin: 0 }}>Xin chào, {fullName} 👋</h2>
          <p style={{ color: "#5F6B7A", marginTop: 4 }}>Đây là trang quản lý thông tin sức khỏe của bạn</p>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
          {[
            { icon: "📋", label: "Lượt khám", value: "3" },
            { icon: "💊", label: "Đơn thuốc", value: "2" },
            { icon: "💳", label: "Hóa đơn chưa thanh toán", value: "1" },
          ].map(card => (
            <div key={card.label} style={{ background: "#fff", borderRadius: 14, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{card.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: PRIMARY }}>{card.value}</div>
              <div style={{ fontSize: 13, color: "#5F6B7A", marginTop: 4 }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Thông tin cá nhân */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: 24 }}>
          <h3 style={{ color: PRIMARY, marginTop: 0 }}>📄 Thông tin cá nhân</h3>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 20, color: '#5F6B7A' }}>Đang tải...</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                ["Họ tên", patient?.fullName || fullName],
                ["Ngày sinh", patient?.dob || "—"],
                ["Giới tính", patient?.gender === "male" ? "Nam" : patient?.gender === "female" ? "Nữ" : patient?.gender || "—"],
                ["Số điện thoại", patient?.phone || "—"],
                ["CCCD", patient?.citizenId || "—"],
                ["Địa chỉ", patient?.address || "—"],
              ].map(([label, value]) => (
                <div key={label} style={{ background: PRIMARY_LIGHT, borderRadius: 8, padding: "12px 16px" }}>
                  <div style={{ fontSize: 12, color: "#5F6B7A" }}>{label}</div>
                  <div style={{ fontWeight: 600, color: PRIMARY, marginTop: 2 }}>{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hồ sơ sức khỏe */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ color: PRIMARY, margin: 0 }}>🩺 Hồ sơ sức khỏe cá nhân</h3>
            <button
              onClick={() => setShowHealthPanel(true)}
              style={{
                background: PRIMARY, color: "#fff", border: "none",
                padding: "8px 18px", borderRadius: 8, fontSize: 13,
                fontWeight: 600, cursor: "pointer",
              }}
            >
              ✏️ Cập nhật
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 20, color: '#5F6B7A' }}>Đang tải...</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Nhóm máu */}
              <div style={{ background: PRIMARY_LIGHT, borderRadius: 8, padding: "12px 16px" }}>
                <div style={{ fontSize: 12, color: "#5F6B7A" }}>🩸 Nhóm máu</div>
                <div style={{ marginTop: 4 }}>
                  {patient?.nhomMau ? (
                    <span style={{
                      fontWeight: 700, fontSize: 16, color: "#fff",
                      background: PRIMARY, padding: "3px 12px", borderRadius: 6,
                    }}>{patient.nhomMau}</span>
                  ) : <span style={{ color: "#9CA3AF", fontSize: 13 }}>Chưa cập nhật</span>}
                </div>
              </div>

              {/* Dị ứng */}
              <div style={{ background: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: 8, padding: "12px 16px" }}>
                <div style={{ fontSize: 12, color: "#92400E" }}>⚠ Dị ứng thuốc</div>
                <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {patient?.diUng ? (
                    patient.diUng.split(",").map(d => d.trim()).filter(Boolean).map((d, i) => (
                      <span key={i} style={{
                        background: "#FEF3C7", border: "1px solid #FCD34D",
                        color: "#92400E", borderRadius: 5, padding: "2px 8px",
                        fontSize: 12, fontWeight: 600,
                      }}>💊 {d}</span>
                    ))
                  ) : <span style={{ color: "#9CA3AF", fontSize: 13 }}>Không có</span>}
                </div>
              </div>

              {/* Tiền sử bệnh */}
              <div style={{ background: PRIMARY_LIGHT, borderRadius: 8, padding: "12px 16px" }}>
                <div style={{ fontSize: 12, color: "#5F6B7A" }}>📋 Tiền sử bệnh</div>
                <div style={{ fontWeight: 500, color: PRIMARY, marginTop: 2, fontSize: 13 }}>
                  {patient?.tienSuBenh || <span style={{ color: "#9CA3AF" }}>Chưa cập nhật</span>}
                </div>
              </div>

              {/* Triệu chứng */}
              <div style={{ background: PRIMARY_LIGHT, borderRadius: 8, padding: "12px 16px" }}>
                <div style={{ fontSize: 12, color: "#5F6B7A" }}>🌡 Triệu chứng hiện tại</div>
                <div style={{ fontWeight: 500, color: PRIMARY, marginTop: 2, fontSize: 13 }}>
                  {patient?.trieuChung || <span style={{ color: "#9CA3AF" }}>Chưa cập nhật</span>}
                </div>
              </div>

              {/* Ghi chú */}
              {(patient?.ghiChu) && (
                <div style={{ gridColumn: "1 / -1", background: PRIMARY_LIGHT, borderRadius: 8, padding: "12px 16px" }}>
                  <div style={{ fontSize: 12, color: "#5F6B7A" }}>📝 Ghi chú</div>
                  <div style={{ fontWeight: 500, color: PRIMARY, marginTop: 2, fontSize: 13 }}>{patient.ghiChu}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal HealthProfilePanel */}
      {showHealthPanel && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(10,45,110,0.35)",
          zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
        }}
          onClick={e => e.target === e.currentTarget && handlePanelClose()}
        >
          <div style={{
            background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560,
            maxHeight: "90vh", overflowY: "auto", padding: "28px 32px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, color: PRIMARY, fontSize: 16 }}>🩺 Cập nhật hồ sơ sức khỏe</h3>
              <button onClick={handlePanelClose} style={{
                background: "none", border: "none", fontSize: 20,
                cursor: "pointer", color: "#5F6B7A", lineHeight: 1,
              }}>✕</button>
            </div>
            <HealthProfilePanel patientId={userId} onClose={handlePanelClose} />
          </div>
        </div>
      )}
    </div>
  )
}