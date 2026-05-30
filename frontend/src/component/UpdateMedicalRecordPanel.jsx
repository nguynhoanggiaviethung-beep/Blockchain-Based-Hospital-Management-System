import { useState } from "react"

const PRIMARY = "#0A2D6E"
const PRIMARY_LIGHT = "#E6F1FB"
const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

export default function UpdateMedicalRecordPanel({ onClose }) {
  const [form, setForm] = useState({
    fullName: localStorage.getItem("fullName") || "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    bloodType: "",
    medicalHistory: "",
    drugAllergies: "",
    currentSymptoms: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      await fetch("/api/patient/medical-record", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      setSuccess(true)
      setTimeout(() => { setSuccess(false); onClose() }, 1800)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: "100%", padding: "9px 13px", borderRadius: 8,
    border: "1px solid #C9D8EE", fontSize: 13, color: "#1a2a40",
    background: "#F8FAFD", outline: "none", boxSizing: "border-box",
    fontFamily: "'Segoe UI', Arial, sans-serif", transition: "border-color 0.2s",
  }
  const labelStyle = {
    fontSize: 11, fontWeight: 600, color: "#5F6B7A",
    textTransform: "uppercase", letterSpacing: "0.05em",
    marginBottom: 4, display: "block",
  }
  const sectionHeadStyle = {
    fontSize: 12, fontWeight: 700, color: PRIMARY,
    textTransform: "uppercase", letterSpacing: "0.08em",
    borderBottom: `2px solid ${PRIMARY_LIGHT}`,
    paddingBottom: 8, marginBottom: 16, marginTop: 8,
  }

  if (success) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "#E6F9F0", border: "2px solid #34C77B",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, margin: "0 auto 16px",
        }}>✓</div>
        <div style={{ fontWeight: 700, fontSize: 16, color: PRIMARY }}>Cập nhật thành công!</div>
        <div style={{ fontSize: 13, color: "#5F6B7A", marginTop: 6 }}>Hồ sơ bệnh án đã được lưu lại.</div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: "4px 0" }}>
      {/* Thông tin cá nhân */}
      <div style={sectionHeadStyle}>👤 Thông tin cá nhân</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Họ và tên <span style={{ color: "#e53e3e" }}>*</span></label>
          <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Nguyễn Văn A" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Ngày sinh <span style={{ color: "#e53e3e" }}>*</span></label>
          <input type="date" name="dob" value={form.dob} onChange={handleChange} required style={{ ...inputStyle, colorScheme: "light" }} />
        </div>
        <div>
          <label style={labelStyle}>Giới tính <span style={{ color: "#e53e3e" }}>*</span></label>
          <select name="gender" value={form.gender} onChange={handleChange} required style={inputStyle}>
            <option value="">Chọn...</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
      </div>

      {/* Liên hệ */}
      <div style={sectionHeadStyle}>📍 Liên hệ</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>Số điện thoại <span style={{ color: "#e53e3e" }}>*</span></label>
          <input name="phone" value={form.phone} onChange={handleChange} required placeholder="0912 345 678" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Địa chỉ</label>
          <input name="address" value={form.address} onChange={handleChange} placeholder="Quận 1, TP.HCM" style={inputStyle} />
        </div>
      </div>

      {/* Y tế */}
      <div style={sectionHeadStyle}>🩺 Thông tin y tế</div>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Nhóm máu</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {BLOOD_TYPES.map((bt) => (
            <button key={bt} type="button" onClick={() => setForm({ ...form, bloodType: bt })}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                border: `1.5px solid ${form.bloodType === bt ? PRIMARY : "#C9D8EE"}`,
                background: form.bloodType === bt ? PRIMARY : "#fff",
                color: form.bloodType === bt ? "#fff" : "#1a2a40",
                transition: "all 0.15s",
              }}
            >{bt}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Tiền sử bệnh án</label>
        <textarea name="medicalHistory" value={form.medicalHistory} onChange={handleChange} rows={3}
          placeholder="Ví dụ: Tiểu đường type 2, cao huyết áp..."
          style={{ ...inputStyle, resize: "vertical" }} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>
          Dị ứng thuốc{" "}
          <span style={{ color: "#d97706", background: "#FEF3C7", padding: "1px 7px", borderRadius: 4, fontSize: 10 }}>⚠ Quan trọng</span>
        </label>
        <textarea name="drugAllergies" value={form.drugAllergies} onChange={handleChange} rows={2}
          placeholder="Ví dụ: Penicillin, Aspirin..."
          style={{ ...inputStyle, resize: "vertical" }} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Triệu chứng / Ghi chú hiện tại</label>
        <textarea name="currentSymptoms" value={form.currentSymptoms} onChange={handleChange} rows={3}
          placeholder="Mô tả triệu chứng bạn đang gặp phải..."
          style={{ ...inputStyle, resize: "vertical" }} />
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button type="button" onClick={onClose}
          style={{
            padding: "9px 22px", borderRadius: 8, border: "1.5px solid #C9D8EE",
            background: "#fff", color: "#5F6B7A", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}
        >Hủy</button>
        <button type="submit" disabled={loading}
          style={{
            padding: "9px 28px", borderRadius: 8, border: "none",
            background: loading ? "#7fa8d8" : PRIMARY, color: "#fff",
            fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: 8, transition: "background 0.2s",
          }}
        >
          {loading && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
              <path d="M4 12a8 8 0 018-8" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
            </svg>
          )}
          {loading ? "Đang lưu..." : "Lưu hồ sơ"}
        </button>
      </div>
    </form>
  )
}