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

<<<<<<< HEAD
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
=======
  const [historyList, setHistoryList] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  // State bộ lọc lịch sử khám
  const [activeStatFilter, setActiveStatFilter] = useState("all")

  const [formBasic, setFormBasic] = useState({
    fullName: "", dob: "", gender: "", phone: "", address: ""
  })

  const [formHealth, setFormHealth] = useState({
    nhomMau: "", tienSuBenh: "", diUng: "", trieuChung: "", ghiChu: ""
  })

  // State quản lý form đăng ký khám bệnh mới
  const [formAppointment, setFormAppointment] = useState({
    specialty: "Nội khoa",
    date: "",
    reason: ""
  })

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }

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
        console.log("Lỗi tải thông tin bệnh nhân:", err)
      } finally {
        setLoading(false)
      }
    }

    const loadHistory = async () => {
      try {
        const res = await fetch(`${BASE_URL}/medical-records/my/history`, { headers })
        const data = await res.json()
        if (data.success) {
          setHistoryList(data.data)
        }
      } catch (err) {
        console.log("Lỗi tải lịch sử bệnh án:", err)
      } finally {
        setLoadingHistory(false)
      }
    }

    if (userId) {
      load()
      loadHistory()
    } else {
      setLoading(false)
      setLoadingHistory(false)
    }
  }, [userId])
>>>>>>> e7c95ccc407151f58352ceaa695cf480dcd46000

  const handlePanelClose = () => {
    setShowHealthPanel(false)
    layThongTin()
  }

<<<<<<< HEAD
=======
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

  // 🔥 HÀM ĐÃ ĐƯỢC SỬA: Đồng bộ lưu lịch hẹn trực tiếp vào Profile Sức Khỏe của Bệnh nhân
  const handleBookAppointment = async (e) => {
    e.preventDefault()
    setSaving(true); setError("")
    try {
      // Tận dụng API cập nhật hồ sơ sức khỏe có sẵn để gửi thông tin đăng ký khám
      const res = await fetch(`${BASE_URL}/patients/${userId}/health-profile`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          nhomMau: formHealth.nhomMau,
          tienSuBenh: formHealth.tienSuBenh,
          diUng: formHealth.diUng,
          trieuChung: formAppointment.reason, // Đưa triệu chứng/lý do khám vào form sức khỏe
          ghiChu: `Đăng ký khám chuyên khoa: ${formAppointment.specialty} - Dự kiến ngày: ${formAppointment.date}` // Lưu lịch hẹn vào mục Ghi chú
        })
      })
      
      const data = await res.json()
      if (data.success) {
        setPatient(data.data) // Cập nhật lại dữ liệu hiển thị toàn màn hình
        // Đồng bộ lại state form hồ sơ sức khỏe cục bộ
        setFormHealth({
          ...formHealth,
          trieuChung: formAppointment.reason,
          ghiChu: `Đăng ký khám chuyên khoa: ${formAppointment.specialty} - Dự kiến ngày: ${formAppointment.date}`
        })
        
        showSuccess("Đăng ký lịch khám bệnh thành công! Thông tin đã được đồng bộ vào hồ sơ.")
        setFormAppointment({ specialty: "Nội khoa", date: "", reason: "" }) // Reset form đăng ký lịch
        setTab("info") // Chuyển ngay về tab thông tin cơ bản để người dùng nhìn thấy kết quả
      } else {
        setError(data.message || "Đăng ký khám thất bại!")
      }
    } catch (err) {
      console.error(err)
      setError("Lỗi kết nối đến máy chủ khi đăng ký lịch khám!")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => { localStorage.clear(); navigate("/") }

  const handleStatCardClick = (filterType) => {
    setActiveStatFilter(filterType)
    setTab("info") 
    const element = document.getElementById("medical-history-section")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

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
    { key: "info", label: "📄 Thông tin & Lịch sử" },
    { key: "register", label: "📅 Đăng ký khám" }, 
    { key: "edit", label: "✏️ Cập nhật" },
    { key: "health", label: "🏥 Sức khỏe" },
  ]

>>>>>>> e7c95ccc407151f58352ceaa695cf480dcd46000
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
<<<<<<< HEAD
          <p style={{ color: "#5F6B7A", marginTop: 4 }}>Đây là trang quản lý thông tin sức khỏe của bạn</p>
=======
          <p style={{ color: GRAY_TEXT, marginTop: 4 }}>Đây là trang quản lý thông tin sức khỏe và lịch sử khám bệnh của bạn</p>
>>>>>>> e7c95ccc407151f58352ceaa695cf480dcd46000
        </div>

        {/* Thống kê */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
          {[
<<<<<<< HEAD
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
=======
            { id: "luotKham", icon: "📋", label: "Lượt khám", value: loadingHistory ? "..." : historyList.length },
            { id: "donThuoc", icon: "💊", label: "Đơn thuốc", value: loadingHistory ? "..." : historyList.length },
            { id: "hoaDon", icon: "💳", label: "Hóa đơn chưa thanh toán", value: "0" },
          ].map(card => {
            const isSelected = activeStatFilter === card.id;
            return (
              <div 
                key={card.label} 
                onClick={() => handleStatCardClick(card.id)} 
                style={{ 
                  background: WHITE, 
                  borderRadius: 14, 
                  padding: "24px", 
                  boxShadow: isSelected ? `0 0 0 2px ${PRIMARY_MED}, 0 4px 20px rgba(26,79,168,0.15)` : "0 2px 12px rgba(0,0,0,0.07)", 
                  cursor: "pointer", 
                  transition: "all 0.2s ease",
                  transform: isSelected ? "scale(1.02)" : "scale(1)"
                }}
                onMouseEnter={(e) => { if(!isSelected) e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)" }}
                onMouseLeave={(e) => { if(!isSelected) e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)" }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>{card.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: PRIMARY }}>{card.value}</div>
                <div style={{ fontSize: 13, color: GRAY_TEXT, marginTop: 4 }}>{card.label}</div>
              </div>
            )
          })}
        </div>

        {/* Giao diện các Tab điều hướng */}
        <div style={{ background: WHITE, borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}` }}>
            {TABS.map(({ key, label }) => (
              <button key={key} onClick={() => { setTab(key); setError(""); setActiveStatFilter("all"); }} style={{
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
            {/* Alert Messages */}
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
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
                    <Field label="Nhóm máu" value={patient?.nhomMau} />
                    <Field label="Dị ứng" value={patient?.diUng} />
                    <Field label="Tiền sử bệnh" value={patient?.tienSuBenh} />
                    <Field label="Triệu chứng hiện tại" value={patient?.trieuChung} />
                    <Field label="Thông tin lịch hẹn" value={patient?.ghiChu} />
                  </div>

                  {/* Lịch sử khám bệnh */}
                  <div id="medical-history-section" style={{ borderTop: `1px solid ${BORDER}`, paddingTop: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <h4 style={{ color: PRIMARY, margin: 0 }}>
                        {activeStatFilter === "luotKham" && "📋 Chi tiết Lịch sử các ca khám bệnh"}
                        {activeStatFilter === "donThuoc" && "💊 Chi tiết các Đơn thuốc điện tử"}
                        {activeStatFilter === "hoaDon" && "💳 Chi tiết Hóa đơn dịch vụ"}
                        {activeStatFilter === "all" && "📜 Toàn bộ Lịch sử ca khám & Đơn thuốc"}
                      </h4>
                      {activeStatFilter !== "all" && (
                        <button 
                          onClick={() => setActiveStatFilter("all")}
                          style={{ background: PRIMARY_LIGHT, border: "none", color: PRIMARY, padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
                        >
                          Hiển thị tất cả
                        </button>
                      )}
                    </div>

                    {loadingHistory ? (
                      <div style={{ fontSize: 13, color: GRAY_TEXT }}>Đang đồng bộ bệnh án...</div>
                    ) : historyList.length === 0 ? (
                      <div style={{ background: "#F8FAFC", padding: "16px", borderRadius: 8, color: GRAY_TEXT, fontSize: 13, fontStyle: "italic", border: `1px solid ${BORDER}` }}>
                        Bạn hiện tại chưa có lịch sử lượt khám nào được ghi nhận trên hệ thống VNmedID.
                      </div>
                    ) : activeStatFilter === "hoaDon" ? (
                      <div style={{ background: "#F8FAFC", padding: "16px", borderRadius: 8, color: GRAY_TEXT, fontSize: 13, fontStyle: "italic", border: `1px solid ${BORDER}` }}>
                        Bạn không có hóa đơn nào chưa thanh toán.
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {historyList.map((record, index) => (
                          <div key={record._id || index} style={{ background: "#F8FAFC", borderRadius: 10, padding: "20px", border: `1px solid ${BORDER}` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, borderBottom: `1px solid ${BORDER}`, paddingBottom: 8 }}>
                              <span style={{ fontWeight: 700, color: PRIMARY }}>Ca bệnh khám số #{historyList.length - index}</span>
                              <span style={{ fontSize: 13, color: GRAY_TEXT, fontWeight: 500 }}>
                                🗓️ Ngày khám: {record.updatedAt ? new Date(record.updatedAt).toLocaleDateString('vi-VN') : "---"}
                              </span>
                            </div>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, fontSize: 14 }}>
                              <div><strong>Bác sĩ chuyên môn phụ trách:</strong> {record.doctorId?.fullName ? `BS. ${record.doctorId.fullName}` : "Bác sĩ bệnh viện"}</div>
                              
                              {(activeStatFilter === "all" || activeStatFilter === "luotKham") && (
                                <div style={{ marginTop: 4 }}>
                                  <strong>Kết luận / Chẩn đoán lâm sàng:</strong> <span style={{ color: "#0A2D6E", fontWeight: 600 }}>{record.chanDoanChuyenMon || "Chưa có kết luận"}</span>
                                </div>
                              )}
                              
                              {(activeStatFilter === "all" || activeStatFilter === "donThuoc") && (
                                <div style={{ whiteSpace: "pre-wrap", background: "#FFFFFF", padding: "12px", borderRadius: 6, border: `1px solid ${BORDER}`, marginTop: 6, fontSize: 13, color: "#1E293B" }}>
                                  <strong style={{ color: "#1A4FA8" }}>💊 Chi tiết hướng điều trị & Đơn thuốc:</strong><br />
                                  {record.huongDieuTri || "Không có đơn thuốc chỉ định"}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )
            )}

            {/* TAB: ĐĂNG KÝ KHÁM BỆNH */}
            {tab === "register" && (
              <div style={{ maxWidth: 600 }}>
                <h4 style={{ color: PRIMARY, marginTop: 0, marginBottom: 20 }}>Đặt lịch hẹn khám trực tuyến</h4>
                <form onSubmit={handleBookAppointment}>
                  
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Chọn Chuyên Khoa Phù Hợp</label>
                    <select 
                      value={formAppointment.specialty}
                      onChange={e => setFormAppointment(p => ({ ...p, specialty: e.target.value }))}
                      style={inputStyle}
                    >
                      <option value="Nội khoa">Nội khoa tổng quát</option>
                      <option value="Ngoại khoa">Ngoại khoa chuyên sâu</option>
                      <option value="Nhi khoa">Nhi khoa (Trẻ em)</option>
                      <option value="Sản phụ khoa">Sản phụ khoa</option>
                      <option value="Tai Mũi Họng">Tai Mũi Họng</option>
                      <option value="Răng Hàm Mặt">Răng Hàm Mặt</option>
                      <option value="Da liễu">Da liễu</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Chọn Ngày Muốn Khám</label>
                    <input 
                      type="date" 
                      required
                      min={new Date().toISOString().split('T')[0]} 
                      value={formAppointment.date}
                      onChange={e => setFormAppointment(p => ({ ...p, date: e.target.value }))}
                      style={inputStyle}
                    >
                    </input>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={labelStyle}>Lý do khám / Triệu chứng lâm sàng</label>
                    <textarea 
                      value={formAppointment.reason}
                      onChange={e => setFormAppointment(p => ({ ...p, reason: e.target.value }))}
                      placeholder="VD: Đau đầu dai dẳng, sốt nhẹ về chiều hoặc đặt lịch tái khám định kỳ..."
                      rows={4}
                      style={{ ...inputStyle, resize: "vertical" }}
                      required
                    />
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <button type="submit" disabled={saving} style={{
                      padding: "11px 28px", borderRadius: 8, border: "none",
                      background: saving ? "#93B8E8" : `linear-gradient(90deg, ${PRIMARY} 0%, ${PRIMARY_MED} 100%)`,
                      color: WHITE, fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer"
                    }}>
                      {saving ? "Đang xử lý gửi..." : "📅 Xác nhận đăng ký"}
                    </button>
                    <button type="button" onClick={() => setTab("info")} style={{
                      padding: "11px 24px", borderRadius: 8, border: `1.5px solid ${BORDER}`,
                      background: WHITE, fontSize: 14, cursor: "pointer", color: GRAY_TEXT
                    }}>
                      Hủy bỏ
                    </button>
                  </div>
                </form>
              </div>
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
>>>>>>> e7c95ccc407151f58352ceaa695cf480dcd46000
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