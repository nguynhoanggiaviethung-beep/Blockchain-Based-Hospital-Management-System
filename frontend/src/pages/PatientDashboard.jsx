import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import HealthProfilePanel from '../components/HealthProfilePanel'

const PRIMARY = "#0A2D6E"
const PRIMARY_MED = "#1A4FA8"
const PRIMARY_LIGHT = "#E6F1FB"

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

        {/* Hồ sơ sức khỏe cá nhân — bệnh nhân tự cập nhật */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ color: PRIMARY, margin: 0 }}>🩺 Hồ sơ sức khỏe cá nhân</h3>
            <button
              onClick={() => setShowHealthPanel(true)}
              style={{ background: PRIMARY, color: "#fff", border: "none", padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              ✏️ Cập nhật
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 20, color: '#5F6B7A' }}>Đang tải...</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: PRIMARY_LIGHT, borderRadius: 8, padding: "12px 16px" }}>
                <div style={{ fontSize: 12, color: "#5F6B7A" }}>🩸 Nhóm máu</div>
                <div style={{ marginTop: 4 }}>
                  {patient?.nhomMau
                    ? <span style={{ fontWeight: 700, fontSize: 16, color: "#fff", background: PRIMARY, padding: "3px 12px", borderRadius: 6 }}>{patient.nhomMau}</span>
                    : <span style={{ color: "#9CA3AF", fontSize: 13 }}>Chưa cập nhật</span>}
                </div>
              </div>

              <div style={{ background: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: 8, padding: "12px 16px" }}>
                <div style={{ fontSize: 12, color: "#92400E" }}>⚠ Dị ứng thuốc</div>
                <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {patient?.diUng
                    ? patient.diUng.split(",").map(d => d.trim()).filter(Boolean).map((d, i) => (
                        <span key={i} style={{ background: "#FEF3C7", border: "1px solid #FCD34D", color: "#92400E", borderRadius: 5, padding: "2px 8px", fontSize: 12, fontWeight: 600 }}>💊 {d}</span>
                      ))
                    : <span style={{ color: "#9CA3AF", fontSize: 13 }}>Không có</span>}
                </div>
              </div>

              <div style={{ background: PRIMARY_LIGHT, borderRadius: 8, padding: "12px 16px" }}>
                <div style={{ fontSize: 12, color: "#5F6B7A" }}>📋 Tiền sử bệnh</div>
                <div style={{ fontWeight: 500, color: PRIMARY, marginTop: 2, fontSize: 13 }}>
                  {patient?.tienSuBenh || <span style={{ color: "#9CA3AF" }}>Chưa cập nhật</span>}
                </div>
              </div>

              <div style={{ background: PRIMARY_LIGHT, borderRadius: 8, padding: "12px 16px" }}>
                <div style={{ fontSize: 12, color: "#5F6B7A" }}>🌡 Triệu chứng hiện tại</div>
                <div style={{ fontWeight: 500, color: PRIMARY, marginTop: 2, fontSize: 13 }}>
                  {patient?.trieuChung || <span style={{ color: "#9CA3AF" }}>Chưa cập nhật</span>}
                </div>
              </div>

              {patient?.ghiChu && (
                <div style={{ gridColumn: "1 / -1", background: PRIMARY_LIGHT, borderRadius: 8, padding: "12px 16px" }}>
                  <div style={{ fontSize: 12, color: "#5F6B7A" }}>📝 Ghi chú</div>
                  <div style={{ fontWeight: 500, color: PRIMARY, marginTop: 2, fontSize: 13 }}>{patient.ghiChu}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* KẾT QUẢ CHẨN ĐOÁN TỪ BÁC SĨ — chỉ đọc */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <h3 style={{ color: PRIMARY, margin: 0 }}>🔬 Kết quả chẩn đoán từ bác sĩ</h3>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", background: "#F3F4F6", border: "1px solid #E5E7EB", padding: "2px 10px", borderRadius: 20 }}>
              🔒 Chỉ xem
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 20, color: '#5F6B7A' }}>Đang tải...</div>
          ) : patient?.medicalAssessment?.chanDoanChuyenMon ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Chẩn đoán */}
              <div style={{ background: "#EFF6FF", border: "1.5px solid #BFDBFE", borderRadius: 10, padding: "14px 18px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1D4ED8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                  🔬 Chẩn đoán chuyên môn
                </div>
                <div style={{ fontSize: 14, color: "#1E3A5F", fontWeight: 600 }}>
                  {patient.medicalAssessment.chanDoanChuyenMon}
                </div>
              </div>

              {/* Hướng điều trị */}
              {patient.medicalAssessment.huongDieuTri && (
                <div style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: 10, padding: "14px 18px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#15803D", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                    💊 Hướng điều trị
                  </div>
                  <div style={{ fontSize: 14, color: "#14532D", fontWeight: 500 }}>
                    {patient.medicalAssessment.huongDieuTri}
                  </div>
                </div>
              )}

              {/* Ghi chú bác sĩ */}
              {patient.medicalAssessment.ghiChuBacSi && (
                <div style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: 10, padding: "14px 18px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#B45309", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                    📝 Ghi chú của bác sĩ
                  </div>
                  <div style={{ fontSize: 14, color: "#78350F", fontWeight: 500 }}>
                    {patient.medicalAssessment.ghiChuBacSi}
                  </div>
                </div>
              )}

              {/* Thời gian */}
              {patient.medicalAssessment.updatedAt && (
                <div style={{ fontSize: 12, color: "#9CA3AF", textAlign: "right" }}>
                  🕐 Cập nhật lúc: {new Date(patient.medicalAssessment.updatedAt).toLocaleString("vi-VN")}
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#9CA3AF", fontSize: 14 }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🩺</div>
              Chưa có kết quả chẩn đoán từ bác sĩ
            </div>
          )}
        </div>
      </div>

      {/* Modal HealthProfilePanel */}
      {showHealthPanel && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(10,45,110,0.35)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={e => e.target === e.currentTarget && handlePanelClose()}
        >
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", padding: "28px 32px", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, color: PRIMARY, fontSize: 16 }}>🩺 Cập nhật hồ sơ sức khỏe</h3>
              <button onClick={handlePanelClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#5F6B7A", lineHeight: 1 }}>✕</button>
            </div>
            <HealthProfilePanel patientId={userId} onClose={handlePanelClose} />
          </div>
        </div>
      )}
    </div>
  )
}