// API Format/src/controllers/medicalRecordController.js
// Giả định bạn đã import Model ở trên cùng (hãy sửa lại đường dẫn cho đúng với dự án của bạn)
const MedicalRecord = require('../models/MedicalRecord'); 

// 1. Hàm tạo bệnh án mới (Giữ nguyên của bạn)
const createRecord = async (req, res) => {
    try {
        // Lấy triệu chứng từ body gửi lên, và lấy patientId của bệnh nhân đang đăng nhập từ token
        const { trieuChung } = req.body;
        const patientId = req.userId; // Middleware xacThucToken giải mã gán vào đây

        if (!trieuChung) {
            return res.status(400).json({ success: false, message: "Vui lòng nhập triệu chứng bệnh ban đầu!" });
        }

        // Tạo một bản ghi khám bệnh mới với trạng thái "Pending" (Chờ bác sĩ khám)
        const newRecord = new MedicalRecord({
            patientId,           // Liên kết trực tiếp với ID tài khoản bệnh nhân thật
            trieuChung,          // Lưu triệu chứng lâm sàng ban đầu
            status: "Pending",   // Đánh dấu trạng thái là Đang chờ khám
            createdAt: new Date()
        });

        await newRecord.save();

        return res.status(201).json({ 
            success: true, 
            message: "Đăng ký ca khám bệnh thành công! Vui lòng đợi bác sĩ gọi tên.",
            data: newRecord 
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
// 🔥 2. THÊM MỚI: Hàm lấy danh sách bệnh nhân THẬT đang chờ khám (Hiện ra bảng của Bác sĩ)
const getPendingRecords = async (req, res) => {
    try {
        // Quét DB tìm toàn bộ bệnh án có trạng thái là "Pending"
        // Sử dụng .populate('patientId') để lấy thông tin cá nhân (Tên, ngày sinh, SĐT, giới tính) của bệnh nhân từ bảng Users/Patients
        const pendingList = await MedicalRecord.find({ status: "Pending" })
                                               .populate('patientId', 'fullName dob gender phone');

        // Định dạng (Format) lại dữ liệu gọn gàng để Frontend React nhận phát hiển thị được ngay
        const formattedData = pendingList.map(item => ({
            _id: item._id, // ID của hồ sơ khám bệnh, dùng để đẩy vào URL khi bác sĩ nhấn nút "Vào khám"
            fullName: item.patientId?.fullName || "Bệnh nhân vãng lai",
            dob: item.patientId?.dob || "",
            gender: item.patientId?.gender || "Nam",
            phone: item.patientId?.phone || "---",
            trieuChung: item.trieuChung || "Khám tổng quát"
        }));

        return res.status(200).json({ success: true, data: formattedData });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Hàm lấy chi tiết bệnh án (Giữ nguyên của bạn)
const getRecordById = async (req, res) => {
    try {
        // Code xử lý lấy bệnh án của bạn...
        return res.status(200).json({ success: true, message: "Lấy chi tiết bệnh án thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Hàm cập nhật bệnh án (Khi bác sĩ bấm lưu chẩn đoán và đơn thuốc)
const updateRecordByDoctor = async (req, res) => {
    try {
        const recordId = req.params.id;
        const { chanDoanChuyenMon, huongDieuTri } = req.body;

        // Lấy doctorId từ middleware decode token (nếu có), hoặc tạm thời lấy từ body gửi lên
        const doctorId = req.userId || req.body.doctorId;

        const updatedRecord = await MedicalRecord.findByIdAndUpdate(
            recordId,
            {
                chanDoanChuyenMon,
                huongDieuTri,
                doctorId,            // Liên kết ID bác sĩ đã khám
                status: "Completed", // Chuyển trạng thái để hiển thị bên phía bệnh nhân
                updatedAt: new Date()
            },
            { new: true } // Trả về dữ liệu mới sau khi sửa
        );

        if (!updatedRecord) {
            return res.status(404).json({ success: false, message: "Không tìm thấy ca bệnh này" });
        }

        return res.status(200).json({ success: true, message: "Cập nhật bệnh án và đơn thuốc thành công!", data: updatedRecord });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 5. Hàm lấy lịch sử bệnh án dành riêng cho Dashboard Bệnh nhân
const getPatientHistory = async (req, res) => {
    try {
        // Lấy Id của bệnh nhân đang đăng nhập từ token (middleware gán vào req.userId)
        const patientId = req.userId; 

        // Tìm tất cả các ca khám của bệnh nhân này ĐÃ HOÀN THÀNH
        const history = await MedicalRecord.find({ 
            patientId: patientId, 
            status: "Completed" 
        }).populate('doctorId', 'fullName specialization'); // Lấy kèm tên và chuyên khoa bác sĩ nếu có liên kết bảng

        return res.status(200).json({ success: true, data: history });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 🔥 GOM XUẤT HÀM CHUẨN ĐỒNG BỘ
module.exports = {
    createRecord,    
    getPendingRecords,    // Đã xuất hàm lấy danh sách chờ khám
    getRecordById,
    updateRecordByDoctor, // Xuất hàm cập nhật của bác sĩ
    getPatientHistory     // Xuất hàm lấy lịch sử của bệnh nhân
};