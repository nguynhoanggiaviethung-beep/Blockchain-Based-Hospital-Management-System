import { useState } from "react"
import { useNavigate } from "react-router-dom"
import UpdateMedicalRecordPanel from "../component/UpdateMedicalRecordPanel"

const PRIMARY = "#0A2D6E"
const PRIMARY_LIGHT = "#E6F1FB"

export default function PatientDashboard() {
  const navigate = useNavigate()
  const [showUpdatePanel, setShowUpdatePanel] = useState(false)
  const fullName = localStorage.getItem("fullName") || "Bệnh nhân"

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .update-panel { animation: slideDown 0.25s ease; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#F4F7FB", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
        {/* Navbar */}
        <div style={{ background: PRIMARY, color: "#fff", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>🏥 VNmedID — Bệnh nhân</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 14 }}>👤 {fullName}</span>
            <button
              onClick={handleLogout}
              style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}
            >
              Đăng xuất
            </button>
          </div>
        </div>

        <div style={{ padding: "32px" }}>
          {/* Greeting */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ color: PRIMARY, margin: 0 }}>Xin chào, {fullName} 👋</h2>
            <p style={{ color: "#5F6B7A", marginTop: 4 }}>Đây là trang quản lý thông tin sức khỏe của bạn</p>
          </div>

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 28 }}>
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

          {/* Cập nhật hồ sơ bệnh án */}
          <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: 24, overflow: "hidden" }}>
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: showUpdatePanel ? `1px solid ${PRIMARY_LIGHT}` : "none", cursor: "pointer" }}
              onClick={() => setShowUpdatePanel(v => !v)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: PRIMARY_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📝</div>
                <div>
                  <div style={{ fontWeight: 700, color: PRIMARY, fontSize: 15 }}>Cập nhật hồ sơ bệnh án</div>
                  <div style={{ fontSize: 12, color: "#5F6B7A", marginTop: 1 }}>Cập nhật thông tin cá nhân và tiền sử bệnh</div>
                </div>
              </div>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", background: PRIMARY_LIGHT,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "transform 0.2s", transform: showUpdatePanel ? "rotate(180deg)" : "rotate(0deg)",
                fontSize: 13, color: PRIMARY, fontWeight: 700,
              }}>▼</div>
            </div>

            {showUpdatePanel && (
              <div className="update-panel" style={{ padding: "24px" }}>
                <UpdateMedicalRecordPanel onClose={() => setShowUpdatePanel(false)} />
              </div>
            )}
          </div>

          {/* Thông tin cá nhân */}
          <div style={{ background: "#fff", borderRadius: 14, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <h3 style={{ color: PRIMARY, marginTop: 0 }}>📄 Thông tin cá nhân</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                ["Họ tên", fullName],
                ["Ngày sinh", ""],
                ["Giới tính", ""],
                ["Số điện thoại", ""],
                ["CCCD", ""],
                ["Địa chỉ", ""],
              ].map(([label, value]) => (
                <div key={label} style={{ background: PRIMARY_LIGHT, borderRadius: 8, padding: "12px 16px" }}>
                  <div style={{ fontSize: 12, color: "#5F6B7A" }}>{label}</div>
                  <div style={{ fontWeight: 600, color: PRIMARY, marginTop: 2 }}>{value || "—"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}