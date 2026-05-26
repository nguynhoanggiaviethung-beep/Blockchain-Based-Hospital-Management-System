// =============================================
// MOCK DATA — VNmedID Hospital Management System
// Cấu trúc theo BE code thật (cập nhật 26/5/2026)
// FE dùng file này code giao diện trong lúc chờ API thật
// =============================================

// FORMAT CHUẨN CHUNG — mọi response đều bọc trong này
// { success: true, message: "...", data: { ... } }

// ============================================
// MODULE 1 — AUTH
// ============================================
export const mockLoginRequest = {
  email: "thu@hospital.vn",
  password: "123456"
}

export const mockLoginResponse = {
  success: true,
  message: "Đăng nhập thành công!",
  data: {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      _id: "64usr001aabbccdd",
      fullName: "Lê Thị Minh Thu",
      email: "thu@hospital.vn",
      role: "doctor" // "patient" | "doctor" | "admin"
    }
  }
}

// ============================================
// MODULE 2 — PATIENT
// ============================================

// POST /api/patients — Request
export const mockCreatePatientRequest = {
  fullName: "Nguyễn Văn A",
  dob: "1990-05-15",          // định dạng YYYY-MM-DD
  gender: "Male",              // "Male" | "Female"
  phone: "0901234567",
  address: "Ho Chi Minh",
  citizenId: "079090012345"   // unique, không được trùng
}

// POST /api/patients — Response
export const mockCreatePatientResponse = {
  success: true,
  message: "Tạo hồ sơ bệnh nhân thành công!",
  data: {
    patientId: "64abc123ef456789"  // chính là _id MongoDB
  }
}

// GET /api/patients/:id — Response
export const mockGetPatientResponse = {
  success: true,
  data: {
    _id: "64abc123ef456789",
    fullName: "Nguyễn Văn A",
    dob: "1990-05-15",
    gender: "Male",
    phone: "0901234567",
    address: "Ho Chi Minh",
    citizenId: "079090012345",
    createdAt: "2026-05-25T08:00:00Z",
    updatedAt: "2026-05-25T08:00:00Z"
  }
}

// Danh sách bệnh nhân (FE tự mock vì BE chưa có GET /patients)
export const mockPatientList = [
  {
    _id: "64abc123ef456789",
    fullName: "Nguyễn Văn A",
    dob: "1990-05-15",
    gender: "Male",
    phone: "0901234567",
    address: "Ho Chi Minh",
    citizenId: "079090012345"
  },
  {
    _id: "64abc124ef456790",
    fullName: "Trần Thị B",
    dob: "1985-08-20",
    gender: "Female",
    phone: "0912345678",
    address: "Hà Nội",
    citizenId: "001085012345"
  }
]

// ============================================
// MODULE 3 — DOCTOR
// ⚠️ BE dùng "fullName" và "specialty" (đã xác nhận lại)
// ============================================

// POST /api/doctors — Request
export const mockCreateDoctorRequest = {
  fullName: "Trần Thị B",         // "fullName" không phải "name"
  specialty: "Nội khoa",          // "specialty" không phải "specialization"
  licenseNumber: "BS-12345",      // unique, không được trùng
  walletAddress: "0x456...def"    // không bắt buộc
}

// POST /api/doctors — Response
export const mockCreateDoctorResponse = {
  success: true,
  message: "Tạo hồ sơ bác sĩ thành công!",
  data: {
    doctorId: "64def456ab789012"  // chính là _id MongoDB
  }
}

// GET /api/doctors/:id — Response
export const mockGetDoctorResponse = {
  success: true,
  data: {
    _id: "64def456ab789012",
    fullName: "Trần Thị B",
    specialty: "Nội khoa",
    licenseNumber: "BS-12345",
    walletAddress: "0x456...def",
    createdAt: "2026-05-25T08:00:00Z"
  }
}

// Danh sách bác sĩ (FE tự mock)
export const mockDoctorList = [
  {
    _id: "64def456ab789012",
    fullName: "Trần Thị B",
    specialty: "Nội khoa",
    licenseNumber: "BS-12345",
    walletAddress: "0x456...def"
  },
  {
    _id: "64def457ab789013",
    fullName: "Nguyễn Văn C",
    specialty: "Ngoại khoa",
    licenseNumber: "BS-12346",
    walletAddress: "0x789...abc"
  }
]

// ============================================
// MODULE 4 — VISIT
// ============================================

// POST /api/visits — Request
export const mockCreateVisitRequest = {
  patientId: "64abc123ef456789",  // _id của Patient
  symptoms: "Đau đầu, sốt cao",
  diagnosis: "Cảm cúm",
  prescription: "Paracetamol 500mg, uống 2 viên/ngày" // STRING (không phải array)
}

// POST /api/visits — Response
export const mockCreateVisitResponse = {
  success: true,
  message: "Tạo lượt khám thành công!",
  data: {
    visitId: "64ghi789cd012345"   // chính là _id MongoDB
  }
}

// Danh sách lượt khám (FE tự mock)
export const mockVisitList = [
  {
    _id: "64ghi789cd012345",
    patientId: "64abc123ef456789",
    symptoms: "Đau đầu, sốt cao",
    diagnosis: "Cảm cúm",
    prescription: "Paracetamol 500mg",
    ipfsHash: "QmXoypuj3abc123",
    createdAt: "2026-05-25T08:30:00Z"
  }
]

// ============================================
// MODULE 4 — MEDICAL RECORD
// ============================================

// POST /api/medical-records — Request
export const mockCreateMedicalRecordRequest = {
  visitId: "64ghi789cd012345",    // _id của Visit
  patientId: "64abc123ef456789",  // _id của Patient
  doctorId: "64def456ab789012",   // _id của Doctor
  diagnosis: "Cảm cúm nặng",
  notes: "Tái khám sau 3 ngày"   // không bắt buộc
}

// POST /api/medical-records — Response
export const mockCreateMedicalRecordResponse = {
  success: true,
  message: "Tạo hồ sơ y tế thành công!",
  data: {
    recordId: "64jkl012ef345678"  // chính là _id MongoDB
  }
}

// PUT /api/medical-records/:id — Request
export const mockUpdateMedicalRecordRequest = {
  diagnosis: "Cảm cúm nặng, có biến chứng",
  notes: "Tái khám sau 5 ngày"
}

// PUT /api/medical-records/:id — Response
export const mockUpdateMedicalRecordResponse = {
  success: true,
  message: "Cập nhật hồ sơ y tế thành công!",
  data: {
    updated: true,
    newIpfsHash: "QmZabc456def789"  // BE tự sinh hash mới
  }
}

// ============================================
// MODULE 6 — INVOICE & PAYMENT (2 bước riêng)
// ============================================

// BƯỚC 1: POST /api/invoices — Tạo hóa đơn (Admin tạo trước)
export const mockCreateInvoiceRequest = {
  invoiceId: "INV001",  // mã hóa đơn tự đặt, unique
  amount: 250000        // số tiền (VNĐ)
}

export const mockCreateInvoiceResponse = {
  success: true,
  message: "Tạo hóa đơn thành công!",
  data: {
    invoiceId: "INV001"
  }
}

// BƯỚC 2: POST /api/payments — Thanh toán MetaMask (Patient thanh toán)
export const mockPaymentRequest = {
  invoiceId: "INV001",
  txHash: "0xabc123def456ghi789"  // mã giao dịch từ MetaMask
}

export const mockPaymentResponse = {
  success: true,
  message: "Thanh toán thành công!",
  data: {
    paymentStatus: "paid"
  }
}

// ============================================
// MODULE 5 — ACCESS CONTROL
// ============================================

// POST /api/access/grant — Cấp quyền (Admin)
export const mockGrantAccessRequest = {
  doctorId: "64def456ab789012",   // _id của Doctor
  patientId: "64abc123ef456789"   // _id của Patient
}

export const mockGrantAccessResponse = {
  success: true,
  message: "Cấp quyền truy cập thành công!",
  data: {
    txHash: "0x1a2b3c4d5e6f..."  // BE giả lập blockchain hash
  }
}

// =============================================
// ⚠️ GHI CHÚ QUAN TRỌNG CHO FE:
// 1. ID dùng _id MongoDB (dạng "64abc123ef456789")
// 2. Doctor dùng "fullName" và "specialty" (đã xác nhận)
// 3. Visit.prescription là STRING
// 4. Invoice tạo trước (POST /invoices), thanh toán sau (POST /payments)
// 5. Access Control chỉ có "grant", chưa có "revoke"
// 6. Khi BE xong: thay mock data bằng gọi API thật
// =============================================
