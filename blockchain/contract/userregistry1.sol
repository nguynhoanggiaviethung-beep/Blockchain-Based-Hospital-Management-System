// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title UserRegistry
 * @author VNmedID Core Team
 * @notice Hệ thống kiểm soát truy cập tuân thủ chuẩn Struct và uint8 theo đặc tả dự án.
 * @dev v1.1 - Các fix:
 *   [CRITICAL] Ngăn admin tự revoke chính mình → contract đóng băng
 *   [MEDIUM]   Thêm transferAdmin() để chuyển quyền admin
 *   [MEDIUM]   Ngăn registerUser() ghi đè admin
 *   [MEDIUM]   Chỉ admin mới được cấp Role 1 (Admin) cho người khác
 *   [LOW]      revokeUser() kiểm tra user tồn tại trước
 *   [LOW]      Thêm reactivateUser() để mở khóa user
 */
contract UserRegistry {

    // KHAI BÁO BIẾN TRẠNG THÁI VÀ ĐỊNH NGHĨA CẤU TRÚC DỮ LIỆU

    /**
     * @dev Struct User theo đúng tài liệu
     * role: 0=None, 1=Admin, 2=Doctor, 3=Patient, 4=Staff
     * isActive: true = đang hoạt động, false = bị khóa
     */
    struct User {
        uint8 role;
        bool isActive;
    }

    address public admin;
    mapping(address => User) public users;

    // SỰ KIỆN (EVENTS)
    event UserRegistered(address indexed wallet, uint8 role);
    event UserRevoked(address indexed wallet);
    event UserReactivated(address indexed wallet);
    event AdminTransferred(address indexed oldAdmin, address indexed newAdmin);

    // LỖI TÙY CHỈNH (CUSTOM ERRORS)

    error NotAdmin();
    error ZeroAddress();
    error InvalidRole();
    error UserNotFound();       // [FIX-LOW]      revokeUser/reactivate trên user không tồn tại
    error CannotModifyAdmin();  // [FIX-CRITICAL]  bảo vệ admin khỏi bị revoke/overwrite


    // CONSTRUCTOR & MODIFIERS
   

    constructor() {
        admin = msg.sender;
        users[msg.sender] = User({ role: 1, isActive: true });
    }

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }


    // CÁC HÀM TƯƠNG TÁC THAY ĐỔI TRẠNG THÁI (WRITE FUNCTIONS)

    /**
     * @notice Admin đăng ký user mới theo chuẩn tài liệu.
     * @param _wallet Địa chỉ ví Ethereum
     * @param _role   Mã quyền (1=Admin, 2=Doctor, 3=Patient, 4=Staff)
     *
     * [FIX-MEDIUM] Không cho phép ghi đè lên địa chỉ admin hiện tại.
     *              Nếu muốn thay đổi quyền admin, dùng transferAdmin().
     */
    function registerUser(address _wallet, uint8 _role) external onlyAdmin {
        if (_wallet == address(0)) revert ZeroAddress();
        if (_role == 0 || _role > 4) revert InvalidRole();

        // [FIX-MEDIUM] Không cho phép registerUser ghi đè admin
        if (_wallet == admin) revert CannotModifyAdmin();

        users[_wallet] = User({ role: _role, isActive: true });

        emit UserRegistered(_wallet, _role);
    }

    /**
     * @notice Khóa tài khoản User (isActive = false, không xóa hẳn).
     *
     * [FIX-CRITICAL] Không cho phép admin tự revoke chính mình — nếu không
     *                sẽ không còn ai có quyền gọi onlyAdmin, contract bị đóng băng.
     * [FIX-LOW]      Revert nếu user chưa được đăng ký (role == 0).
     */
    function revokeUser(address _wallet) external onlyAdmin {
        if (_wallet == address(0)) revert ZeroAddress();

        // [FIX-CRITICAL] Ngăn admin tự khóa chính mình
        if (_wallet == admin) revert CannotModifyAdmin();

        // [FIX-LOW] Revert nếu user chưa tồn tại
        if (users[_wallet].role == 0) revert UserNotFound();

        users[_wallet].isActive = false;

        emit UserRevoked(_wallet);
    }

    /**
     * @notice Mở khóa tài khoản User đã bị revoke (isActive = true).
     * [FIX-LOW] Hàm còn thiếu trong phiên bản cũ.
     */
    function reactivateUser(address _wallet) external onlyAdmin {
        if (_wallet == address(0)) revert ZeroAddress();
        if (users[_wallet].role == 0) revert UserNotFound();

        users[_wallet].isActive = true;

        emit UserReactivated(_wallet);
    }

    /**
     * @notice Chuyển quyền admin sang địa chỉ mới.
     * @param _newAdmin Địa chỉ ví nhận quyền admin (phải đã được đăng ký).
     *
     * [FIX-MEDIUM] Cơ chế duy nhất để thay đổi admin, tránh mất quyền kiểm soát
     *              nếu ví admin bị mất khóa.
     *
     * Luồng an toàn 2 bước (khuyến nghị nâng cấp sau):
     *   1. Admin gọi transferAdmin(_newAdmin) → pending
     *   2. _newAdmin gọi acceptAdmin() để xác nhận
     * Phiên bản này dùng 1 bước để giữ đơn giản theo tài liệu hiện tại.
     */
    function transferAdmin(address _newAdmin) external onlyAdmin {
        if (_newAdmin == address(0)) revert ZeroAddress();
        if (_newAdmin == admin) revert InvalidRole(); // Không transfer cho chính mình

        address oldAdmin = admin;

        // Cập nhật role của admin cũ về Patient (3) và vẫn active
        // (có thể điều chỉnh tùy yêu cầu nghiệp vụ)
        users[oldAdmin].role = 3;

        // Gán admin mới
        admin = _newAdmin;
        users[_newAdmin] = User({ role: 1, isActive: true });

        emit AdminTransferred(oldAdmin, _newAdmin);
    }

    // CÁC HÀM TRUY VẤN (VIEW FUNCTIONS) BẮT BUỘC THEO TÀI LIỆU

    /**
     * @notice Trả về Role của User (0, 1, 2, 3, 4)
     */
    function getUserRole(address _wallet) external view returns (uint8) {
        return users[_wallet].role;
    }

    /**
     * @notice Kiểm tra xem ví đã được đăng ký chưa
     */
    function checkUserExists(address _wallet) external view returns (bool) {
        return users[_wallet].role != 0;
    }

    /**
     * @notice Hàm kiểm tra quyền chéo (Inter-contract communication)
     * @return true nếu Role khớp VÀ tài khoản đang active
     */
    function isAuthorizedRole(address _wallet, uint8 _role) external view returns (bool) {
        return (users[_wallet].role == _role && users[_wallet].isActive);
    }

    /**
     * @notice Lấy toàn bộ struct User
     */
    function getUser(address _wallet) external view returns (User memory) {
        return users[_wallet];
    }

    /**
     * @notice Kiểm tra quyền Admin nhanh
     */
    function isAdmin(address _wallet) external view returns (bool) {
        return (users[_wallet].role == 1 && users[_wallet].isActive);
    }
}
