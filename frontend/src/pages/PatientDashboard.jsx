import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const PRIMARY = "#0A2D6E"
const PRIMARY_MED = "#1A4FA8"
const PRIMARY_LIGHT = "#E6F1FB"
const WHITE = "#FFFFFF"
const GRAY_TEXT = "#5F6B7A"
const BORDER = "#CBD5E1"

const BASE_URL = "http://localhost:5000/api/v1"

export default function PatientDashboard() {
  const navigate = useNavigate()
  const fullName = localStorage.getItem("fullName") || "Bệnh nhân"
  const userId = localStorage.getItem("userId")
  const token = localStorage.getItem("token")

  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("info")
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState("")
  const [error, setError] = useState("")

  const [formBasic, setFormBasic] = useState({
    fullName: "", dob: "", gender: "", phone: "", address: ""
  })

  const [formHealth, setFormHealth] = useState({
    nhomMau: "", tienSuBenh: "", diUng: "", trieuChung: "", ghiChu: ""
  })

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }

  // Load thông tin bệnh nhân
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BASE_URL}/patients/${userId}`, { headers })
        const data = await res.json()
        if (data.success) {
          const d = data.data
          setPatient(d)
          setFormBasic({
            fullName: d.fullName || "",
            dob: d.dob ? d.dob.substring(0, 10) : "",
            gender: d.gender || "",
            phone: d.phone || "",
            address: d.address || "",
          })
          setFormHealth({
            nhomMau: d.nhomMau || "",
            tienSuBenh: d.tienSuBenh || "",
            diUng: d.diUng || "",
            trieuChung: d.trieuChung || "",
            ghiChu: d.ghiChu || "",
          })
        }
      } catch (err) {
        console.log("Lỗi:", err)
      } finally {
        setLoading(false)
      }
    }
    if (userId) load()
    else setLoading(false)
  }, [])

  const showSuccess = (msg) => {
    setSaveSuccess(msg)
    setTimeout(() => setSaveSuccess(""), 3000)
  }

  // Cập nhật thông tin cơ bản
  const handleSaveBasic = async () => {
    setSaving(true); setError("")
    try {
      const res = await fetch(`${BASE_URL}/patients/${userId}`, {
        method: "PUT", headers,
        body: JSON.stringify(formBasic)
      })
      const data = await res.json()
      if (data.success) {
        setPatient(data.data)
        showSuccess("Cập nhật thông tin thành công!")
        setTab("info")
      } else {
        setError(data.message || "Cập nhật thất bại!")
      }
    } catch {
      setError("Lỗi kết nối server!")
    } finally {
      setSaving(false)
    }
  }

  // Cập nhật hồ sơ sức khỏe
  const handleSaveHealth = async () => {
    setSaving(true); setError("")
    try {
      const res = await fetch(`${BASE_URL}/patients/${userId}/health-profile`, {
        method: "PUT", headers,
        body: JSON.stringify(formHealth)
      })
      const data = await res.json()
      if (data.success) {
        setPatient(data.data)
        showSuccess("Cập nhật hồ sơ sức khỏe thành công!")
        setTab("info")
      } else {
        setError(data.message || "Cập nhật thất bại!")
      }
    } catch {
      setError("Lỗi kết nối server!")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => { localStorage.clear(); navigate("/") }

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: `1.5px solid ${BORDER}`, fontSize: 14, outline: "none",
    boxSizing: "border-box", background: WHITE, marginTop: 4,
    color: "#0A2D6E",
  }

  const labelStyle = { fontSize: 13, fontWeight: 500, color: "#374151" }

  const Field = ({ label, value }) => (
    <div style={{ background: PRIMARY_LIGHT, borderRadius: 8, padding: "12px 16px" }}>
      <div style={{ fontSize: 12, color: GRAY_TEXT }}>{label}</div>
      <div style={{ fontWeight: 600, color: PRIMARY, marginTop: 2 }}>{value || "—"}</div>
    </div>
  )

  const TABS = [
    { key: "info", label: "📄 Thông tin" },
    { key: "edit", label: "✏️ Cập nhật" },
    { key: "health", label: "🏥 Sức khỏe" },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "#F4F7FB", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      {/* Navbar */}
      <div style={{ background: PRIMARY, color: WHITE, padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>🏥 VNmedID — Bệnh nhân</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14 }}>👤 {fullName}</span>
          <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: WHITE, padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
            Đăng xuất
          </button>
        </div>
      </div>

      <div style={{ padding: "32px" }}>
        {/* Greeting */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ color: PRIMARY, margin: 0 }}>Xin chào, {fullName} 👋</h2>
          <p style={{ color: GRAY_TEXT, marginTop: 4 }}>Đây là trang quản lý thông tin sức khỏe của bạn</p>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
          {[
            { icon: "📋", label: "Lượt khám", value: "3" },
            { icon: "💊", label: "Đơn thuốc", value: "2" },
            { icon: "💳", label: "Hóa đơn chưa thanh toán", value: "1" },
          ].map(card => (
            <div key={card.label} style={{ background: WHITE, borderRadius: 14, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{card.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: PRIMARY }}>{card.value}</div>
              <div style={{ fontSize: 13, color: GRAY_TEXT, marginTop: 4 }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Card với 3 tab */}
        <div style={{ background: WHITE, borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          {/* Tab buttons */}
          <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}` }}>
            {TABS.map(({ key, label }) => (
              <button key={key} onClick={() => { setTab(key); setError("") }} style={{
                padding: "14px 24px", border: "none", background: "none", cursor: "pointer",
                fontSize: 14, fontWeight: tab === key ? 600 : 400,
                color: tab === key ? PRIMARY : GRAY_TEXT,
                borderBottom: tab === key ? `2px solid ${PRIMARY}` : "2px solid transparent",
              }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ padding: "24px" }}>
            {/* Thông báo */}
            {saveSuccess && (
              <div style={{ background: "#E6F9F0", color: "#0F6E56", borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontSize: 13 }}>
                ✅ {saveSuccess}
              </div>
            )}
            {error && (
              <div style={{ background: "#FEF2F2", color: "#E24B4A", borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontSize: 13 }}>
                ❌ {error}
              </div>
            )}

            {/* Tab: Xem thông tin */}
            {tab === "info" && (
              loading ? (
                <div style={{ textAlign: "center", padding: 20, color: GRAY_TEXT }}>Đang tải...</div>
              ) : (
                <>
                  <h4 style={{ color: PRIMARY, marginTop: 0 }}>Thông tin cơ bản</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                    <Field label="Họ tên" value={patient?.fullName} />
                    <Field label="Ngày sinh" value={patient?.dob?.substring(0, 10)} />
                    <Field label="Giới tính" value={patient?.gender} />
                    <Field label="Số điện thoại" value={patient?.phone} />
                    <Field label="CCCD" value={patient?.citizenId} />
                    <Field label="Địa chỉ" value={patient?.address} />
                  </div>

                  <h4 style={{ color: PRIMARY }}>Hồ sơ sức khỏe</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Field label="Nhóm máu" value={patient?.nhomMau} />
                    <Field label="Dị ứng" value={patient?.diUng} />
                    <Field label="Tiền sử bệnh" value={patient?.tienSuBenh} />
                    <Field label="Triệu chứng" value={patient?.trieuChung} />
                    <Field label="Ghi chú" value={patient?.ghiChu} />
                  </div>
                </>
              )
            )}

            {/* Tab: Cập nhật thông tin cơ bản */}
            {tab === "edit" && (
              <div style={{ maxWidth: 600 }}>
                {[
                  { label: "Họ tên", field: "fullName", type: "text" },
                  { label: "Ngày sinh", field: "dob", type: "date" },
                  { label: "Số điện thoại", field: "phone", type: "text" },
                  { label: "Địa chỉ", field: "address", type: "text" },
                ].map(({ label, field, type }) => (
                  <div key={field} style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>{label}</label>
                    <input type={type} value={formBasic[field]}
                      onChange={e => setFormBasic(p => ({ ...p, [field]: e.target.value }))}
                      style={inputStyle} />
                  </div>
                ))}

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Giới tính</label>
                  <select value={formBasic.gender}
                    onChange={e => setFormBasic(p => ({ ...p, gender: e.target.value }))}
                    style={inputStyle}>
                    <option value="">-- Chọn --</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={handleSaveBasic} disabled={saving} style={{
                    padding: "10px 24px", borderRadius: 8, border: "none",
                    background: saving ? "#93B8E8" : `linear-gradient(90deg, ${PRIMARY} 0%, ${PRIMARY_MED} 100%)`,
                    color: WHITE, fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer"
                  }}>
                    {saving ? "Đang lưu..." : "💾 Lưu thay đổi"}
                  </button>
                  <button onClick={() => setTab("info")} style={{
                    padding: "10px 24px", borderRadius: 8, border: `1.5px solid ${BORDER}`,
                    background: WHITE, fontSize: 14, cursor: "pointer", color: GRAY_TEXT
                  }}>Huỷ</button>
                </div>
              </div>
            )}

            {/* Tab: Cập nhật hồ sơ sức khỏe */}
            {tab === "health" && (
              <div style={{ maxWidth: 600 }}>
                {[
                  { label: "Nhóm máu", field: "nhomMau", placeholder: "A, B, AB, O..." },
                  { label: "Tiền sử bệnh", field: "tienSuBenh", placeholder: "VD: Tiểu đường, cao huyết áp..." },
                  { label: "Dị ứng", field: "diUng", placeholder: "VD: Penicillin, hải sản..." },
                  { label: "Triệu chứng hiện tại", field: "trieuChung", placeholder: "Mô tả triệu chứng..." },
                  { label: "Ghi chú", field: "ghiChu", placeholder: "Ghi chú thêm..." },
                ].map(({ label, field, placeholder }) => (
                  <div key={field} style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>{label}</label>
                    <textarea value={formHealth[field]}
                      onChange={e => setFormHealth(p => ({ ...p, [field]: e.target.value }))}
                      placeholder={placeholder}
                      rows={2}
                      style={{ ...inputStyle, resize: "vertical" }} />
                  </div>
                ))}

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={handleSaveHealth} disabled={saving} style={{
                    padding: "10px 24px", borderRadius: 8, border: "none",
                    background: saving ? "#93B8E8" : `linear-gradient(90deg, ${PRIMARY} 0%, ${PRIMARY_MED} 100%)`,
                    color: WHITE, fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer"
                  }}>
                    {saving ? "Đang lưu..." : "💾 Lưu hồ sơ sức khỏe"}
                  </button>
                  <button onClick={() => setTab("info")} style={{
                    padding: "10px 24px", borderRadius: 8, border: `1.5px solid ${BORDER}`,
                    background: WHITE, fontSize: 14, cursor: "pointer", color: GRAY_TEXT
                  }}>Huỷ</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}