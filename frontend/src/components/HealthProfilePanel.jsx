import { useState, useEffect, useRef } from "react"

const PRIMARY = "#0A2D6E"
const PRIMARY_MED = "#1A4FA8"
const PRIMARY_LIGHT = "#E6F1FB"
const SUCCESS = "#059669"
const WARNING = "#D97706"
const ERROR = "#DC2626"
const BORDER = "#C9D8EE"
const GRAY = "#5F6B7A"

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

const DRUG_SUGGESTIONS = [
  "Penicillin", "Amoxicillin", "Ampicillin", "Aspirin", "Ibuprofen",
  "Paracetamol", "Acetaminophen", "Codeine", "Morphine", "Tramadol",
  "Diclofenac", "Naproxen", "Celecoxib", "Metformin", "Insulin",
  "Atorvastatin", "Simvastatin", "Amlodipine", "Lisinopril", "Losartan",
  "Metoprolol", "Atenolol", "Warfarin", "Heparin", "Clopidogrel",
  "Omeprazole", "Pantoprazole", "Ranitidine", "Metronidazole", "Ciprofloxacin",
  "Azithromycin", "Doxycycline", "Tetracycline", "Erythromycin", "Clarithromycin",
  "Sulfamethoxazole", "Trimethoprim", "Fluconazole", "Ketoconazole", "Clotrimazole",
  "Prednisolone", "Dexamethasone", "Hydrocortisone", "Methylprednisolone",
  "Cetirizine", "Loratadine", "Diphenhydramine", "Chlorpheniramine",
  "Salbutamol", "Terbutaline", "Theophylline", "Montelukast",
  "Diazepam", "Lorazepam", "Alprazolam", "Clonazepam",
  "Amitriptyline", "Sertraline", "Fluoxetine", "Escitalopram",
  "Carbamazepine", "Phenytoin", "Valproate", "Gabapentin", "Pregabalin",
  "Ceftriaxone", "Cefuroxime", "Cephalexin", "Vancomycin", "Gentamicin",
  "Streptomycin", "Rifampicin", "Isoniazid", "Ethambutol",
  "Chloroquine", "Quinine", "Artesunate", "Ivermectin",
  "Acyclovir", "Oseltamivir", "Ribavirin",
  "Lidocaine", "Bupivacaine", "Procaine",
  "Contrast dye (thuốc cản quang)", "Latex (cao su tự nhiên)",
]

function DrugInput({ value, onChange }) {
  const [inputVal, setInputVal] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSug, setShowSug] = useState(false)
  const inputRef = useRef(null)
  const wrapRef = useRef(null)

  const tags = value ? value.split(",").map(t => t.trim()).filter(Boolean) : []

  const handleInput = (e) => {
    const v = e.target.value
    setInputVal(v)
    if (v.trim().length >= 1) {
      const filtered = DRUG_SUGGESTIONS.filter(d =>
        d.toLowerCase().includes(v.toLowerCase()) && !tags.includes(d)
      ).slice(0, 6)
      setSuggestions(filtered)
      setShowSug(filtered.length > 0)
    } else {
      setShowSug(false)
    }
  }

  const addTag = (drug) => {
    const newTags = [...tags, drug]
    onChange(newTags.join(", "))
    setInputVal("")
    setShowSug(false)
    inputRef.current?.focus()
  }

  const removeTag = (idx) => {
    const newTags = tags.filter((_, i) => i !== idx)
    onChange(newTags.join(", "))
  }

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inputVal.trim()) {
      e.preventDefault()
      addTag(inputVal.trim())
    }
    if (e.key === "Backspace" && !inputVal && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowSug(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <div style={{
        minHeight: 44, padding: "6px 10px", borderRadius: 8,
        border: `1.5px solid ${BORDER}`, background: "#F8FAFD",
        display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center",
        cursor: "text", boxSizing: "border-box",
      }} onClick={() => inputRef.current?.focus()}>
        {tags.map((tag, i) => (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            background: "#FEF3C7", border: "1px solid #FCD34D",
            color: "#92400E", borderRadius: 6, padding: "2px 8px",
            fontSize: 12, fontWeight: 600,
          }}>
            ⚠ {tag}
            <button onClick={() => removeTag(i)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#92400E", fontSize: 14, padding: 0, lineHeight: 1,
              display: "flex", alignItems: "center",
            }}>×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={inputVal}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => inputVal && setShowSug(suggestions.length > 0)}
          placeholder={tags.length === 0 ? "Nhập tên thuốc rồi Enter... (VD: Penicillin)" : "Thêm thuốc..."}
          style={{
            border: "none", outline: "none", background: "transparent",
            fontSize: 13, color: "#1a2a40", flex: 1, minWidth: 160,
            fontFamily: "'Segoe UI', Arial, sans-serif",
          }}
        />
      </div>

      {showSug && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#fff", border: `1.5px solid ${BORDER}`, borderRadius: 8,
          boxShadow: "0 8px 24px rgba(10,45,110,0.12)", zIndex: 100, overflow: "hidden",
        }}>
          <div style={{ padding: "6px 10px", fontSize: 11, color: GRAY, background: PRIMARY_LIGHT, fontWeight: 600 }}>
            💊 Gợi ý thuốc — nhấn để chọn
          </div>
          {suggestions.map((s, i) => (
            <div key={i} onMouseDown={() => addTag(s)} style={{
              padding: "9px 14px", fontSize: 13, cursor: "pointer",
              color: "#1a2a40", transition: "background 0.1s",
              borderTop: i === 0 ? "none" : `1px solid ${PRIMARY_LIGHT}`,
            }}
              onMouseEnter={e => e.currentTarget.style.background = PRIMARY_LIGHT}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              💊 {s}
            </div>
          ))}
        </div>
      )}
      <div style={{ fontSize: 11, color: GRAY, marginTop: 4 }}>
        Gõ tên thuốc → chọn gợi ý hoặc nhấn Enter để thêm. Nhấn ✕ để xoá.
      </div>
    </div>
  )
}

export default function HealthProfilePanel({ patientId, onClose }) {
  const [form, setForm] = useState({
    nhomMau: "",
    tienSuBenh: "",
    diUng: "",
    trieuChung: "",
    ghiChu: "",
  })
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // ✅ Fetch dữ liệu hiện tại từ đúng route
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        const id = patientId || localStorage.getItem("userId")
        const res = await fetch(`http://localhost:5000/api/v1/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          const p = data.data || data
          setForm({
            nhomMau:    p.nhomMau    || "",
            tienSuBenh: p.tienSuBenh || "",
            diUng:      p.diUng      || "",
            trieuChung: p.trieuChung || "",
            ghiChu:     p.ghiChu     || "",
          })
        }
      } catch (err) {
        console.error("Lỗi fetch hồ sơ:", err)
      } finally {
        setFetching(false)
      }
    }
    fetchData()
  }, [patientId])

  // ✅ Submit đến đúng route PUT /api/v1/patients/:id/health-profile
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      const id = patientId || localStorage.getItem("userId")
      const res = await fetch(`http://localhost:5000/api/v1/patients/${id}/health-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => { setSuccess(false); onClose?.() }, 2000)
      } else {
        const data = await res.json()
        setError(data.message || "Cập nhật thất bại!")
      }
    } catch (err) {
      setError("Lỗi kết nối máy chủ!")
    } finally {
      setLoading(false)
    }
  }

  const inp = {
    width: "100%", padding: "10px 13px", borderRadius: 8,
    border: `1.5px solid ${BORDER}`, fontSize: 13, color: "#1a2a40",
    background: "#F8FAFD", outline: "none", boxSizing: "border-box",
    fontFamily: "'Segoe UI', Arial, sans-serif", resize: "vertical",
  }
  const labelStyle = {
    fontSize: 11, fontWeight: 700, color: GRAY,
    textTransform: "uppercase", letterSpacing: "0.06em",
    marginBottom: 6, display: "block",
  }
  const section = {
    fontSize: 11, fontWeight: 700, color: PRIMARY,
    textTransform: "uppercase", letterSpacing: "0.08em",
    borderBottom: `2px solid ${PRIMARY_LIGHT}`,
    paddingBottom: 8, marginBottom: 16, marginTop: 4,
  }

  if (fetching) return (
    <div style={{ textAlign: "center", padding: "48px 0", color: GRAY }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        border: `3px solid ${PRIMARY_LIGHT}`, borderTopColor: PRIMARY,
        animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
      }} />
      Đang tải hồ sơ sức khỏe...
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (success) return (
    <div style={{ textAlign: "center", padding: "48px 0" }}>
      <div style={{
        width: 68, height: 68, borderRadius: "50%",
        background: "#D1FAE5", border: `2px solid ${SUCCESS}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 30, margin: "0 auto 16px",
      }}>✓</div>
      <div style={{ fontWeight: 700, fontSize: 17, color: SUCCESS }}>Cập nhật thành công!</div>
      <div style={{ fontSize: 13, color: GRAY, marginTop: 6 }}>Hồ sơ sức khỏe của bạn đã được lưu.</div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} style={{ padding: "4px 0" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {error && (
        <div style={{
          background: "#FEF2F2", border: `1px solid ${ERROR}`, borderRadius: 8,
          padding: "10px 14px", marginBottom: 16, fontSize: 13, color: ERROR,
        }}>⚠ {error}</div>
      )}

      {/* Nhóm máu */}
      <div style={section}>🩸 Nhóm máu</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {BLOOD_TYPES.map(bt => (
          <button key={bt} type="button"
            onClick={() => setForm(f => ({ ...f, nhomMau: bt }))}
            style={{
              padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700,
              cursor: "pointer", transition: "all 0.15s",
              border: `1.5px solid ${form.nhomMau === bt ? PRIMARY : BORDER}`,
              background: form.nhomMau === bt ? PRIMARY : "#fff",
              color: form.nhomMau === bt ? "#fff" : "#1a2a40",
              boxShadow: form.nhomMau === bt ? "0 2px 8px rgba(10,45,110,0.2)" : "none",
            }}
          >{bt}</button>
        ))}
        {form.nhomMau && (
          <button type="button" onClick={() => setForm(f => ({ ...f, nhomMau: "" }))}
            style={{
              padding: "7px 14px", borderRadius: 8, fontSize: 12,
              border: `1px solid ${BORDER}`, background: "#fff",
              color: GRAY, cursor: "pointer",
            }}>✕ Bỏ chọn</button>
        )}
      </div>

      {/* Tiền sử bệnh */}
      <div style={section}>📋 Tiền sử bệnh</div>
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Các bệnh lý đã/đang mắc</label>
        <textarea
          value={form.tienSuBenh}
          onChange={e => setForm(f => ({ ...f, tienSuBenh: e.target.value }))}
          rows={3}
          placeholder="VD: Tiểu đường type 2, cao huyết áp, viêm gan B..."
          style={inp}
        />
      </div>

      {/* Dị ứng */}
      <div style={section}>⚠ Dị ứng thuốc</div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ ...labelStyle, color: WARNING }}>
          Tên thuốc gây dị ứng
          <span style={{ fontSize: 10, background: "#FEF3C7", color: WARNING, padding: "1px 7px", borderRadius: 4, fontWeight: 600, marginLeft: 6 }}>Quan trọng</span>
        </label>
        <DrugInput
          value={form.diUng}
          onChange={val => setForm(f => ({ ...f, diUng: val }))}
        />
      </div>

      {/* Triệu chứng */}
      <div style={section}>🌡 Triệu chứng hiện tại</div>
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Mô tả triệu chứng bạn đang gặp</label>
        <textarea
          value={form.trieuChung}
          onChange={e => setForm(f => ({ ...f, trieuChung: e.target.value }))}
          rows={3}
          placeholder="VD: Đau đầu, chóng mặt, khó thở khi gắng sức..."
          style={inp}
        />
      </div>

      {/* Ghi chú */}
      <div style={section}>📝 Ghi chú thêm</div>
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Thông tin khác bạn muốn bác sĩ biết</label>
        <textarea
          value={form.ghiChu}
          onChange={e => setForm(f => ({ ...f, ghiChu: e.target.value }))}
          rows={2}
          placeholder="VD: Đang mang thai, đang dùng thuốc huyết áp hàng ngày..."
          style={inp}
        />
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        {onClose && (
          <button type="button" onClick={onClose} style={{
            padding: "10px 22px", borderRadius: 8,
            border: `1.5px solid ${BORDER}`, background: "#fff",
            color: GRAY, fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Hủy</button>
        )}
        <button type="submit" disabled={loading} style={{
          padding: "10px 28px", borderRadius: 8, border: "none",
          background: loading ? "#93B8E8" : `linear-gradient(90deg, ${PRIMARY}, ${PRIMARY_MED})`,
          color: "#fff", fontSize: 13, fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          {loading && (
            <div style={{
              width: 14, height: 14, borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
              animation: "spin 0.8s linear infinite",
            }} />
          )}
          {loading ? "Đang lưu..." : "💾 Lưu hồ sơ"}
        </button>
      </div>
    </form>
  )
}