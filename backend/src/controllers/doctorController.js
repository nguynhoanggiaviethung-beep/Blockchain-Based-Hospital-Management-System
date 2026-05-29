// API Format/src/controllers/doctorController.js
const Doctor = require('../models/doctor');
const bcrypt = require('bcrypt');

/**
 * @desc    Tạo hồ sơ bác sĩ mới (Phân quyền: Admin)
 * @route   POST /api/v1/doctors
 */
const createDoctor = async (req, res) => {
    try {
        const { fullName, specialty, licenseNumber, walletAddress, email, password } = req.body;

        // 1. KIỂM TRA ĐẦU VÀO: Đảm bảo không bỏ trống trường bắt buộc
        if (!fullName || !licenseNumber || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Vui lòng điền đầy đủ các trường bắt buộc (Họ tên, Số giấy phép, Email, Mật khẩu)!' 
            });
        }

        // 2. KIỂM TRA TRÙNG LẶP: Quét DB xem Email hoặc Số giấy phép đã tồn tại chưa
        const isDuplicate = await Doctor.findOne({
            $or: [ { email }, { licenseNumber } ]
        });

        if (isDuplicate) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email hoặc Số giấy phép này đã được đăng ký trên hệ thống!' 
            });
        }

        // 3. MÃ HÓA MẬT KHẨU: Chuẩn hóa băm an toàn 1 lớp
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. KHỞI TẠO ĐỐI TƯỢNG: Gán giá trị sạch sẽ vào Model
        const newDoctor = new Doctor({
            fullName,
            specialty,
            licenseNumber,
            walletAddress,
            email,
            password: hashedPassword,
            role: 'doctor' // Đảm bảo gán cứng vai trò để phân quyền đăng nhập ngoài Web
        });

        // 5. LƯU XUỐNG DATABASE
        await newDoctor.save();

        // 6. PHẢN HỒI THÀNH CÔNG: Trả về kèm thông tin cơ bản để Front-end xử lý tiếp
        return res.status(201).json({ 
            success: true, 
            message: 'Tạo hồ sơ bác sĩ thành công!',
            data: {
                id: newDoctor._id,
                fullName: newDoctor.fullName,
                email: newDoctor.email
            }
        });

    } catch (error) {
        // Bắt lỗi hệ thống hoặc lỗi kết nối DB
        return res.status(500).json({ 
            success: false, 
            message: 'Lỗi hệ thống khi tạo bác sĩ!', 
            error: error.message 
        });
    }
};

/**
 * @desc    Lấy chi tiết thông tin 1 bác sĩ bằng ID
 * @route   GET /api/v1/doctors/:id
 */
const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Tìm và gạt bỏ password ra khỏi kết quả trả về để bảo mật
        const doctor = await Doctor.findById(id).select('-password'); 
        
        if (!doctor) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy thông tin bác sĩ yêu cầu!' 
            });
        }
        
        return res.status(200).json({ 
            success: true, 
            data: doctor 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Lỗi hệ thống khi truy vấn dữ liệu bác sĩ!', 
            error: error.message 
        });
    }
};

// Xuất bản các hàm xử lý ra Router gác cổng
module.exports = {
    createDoctor,
    getDoctorById
};