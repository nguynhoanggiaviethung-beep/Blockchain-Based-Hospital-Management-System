// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title UserRegistry
 * @author VNmedID Core Team
 * @notice Hệ thống kiểm soát truy cập dựa trên vai trò (RBAC) nền tảng cho
 *         hệ thống y tế phi tập trung VNmedID. Quản lý các vai trò ADMIN,
 *         DOCTOR và PATIENT trên chuỗi. Các hợp đồng khác trong hệ thống
 *         gọi hàm `checkRole` để thực thi kiểm soát truy cập mà không
 *         cần lặp lại logic.
 * @dev    Tất cả các hàm thay đổi trạng thái nhạy cảm được bảo vệ bởi
 *         modifier `onlyAdmin`. Hằng số vai trò là `bytes32` keccak256 —
 *         rẻ hơn để lưu trữ và so sánh so với chuỗi ký tự.
 */
contract UserRegistry {

    // 
    // Hằng Số Vai Trò

    /// @notice Định danh vai trò Quản trị viên.
    bytes32 public constant ADMIN   = keccak256("ADMIN");

    /// @notice Định danh vai trò Bác sĩ.
    bytes32 public constant DOCTOR  = keccak256("DOCTOR");

    /// @notice Định danh vai trò Bệnh nhân.
    bytes32 public constant PATIENT = keccak256("PATIENT");

    // Trạng Thái

    /**
     * @dev ví => vai trò => có vai trò
     *      Một địa chỉ có thể giữ tối đa một vai trò chăm sóc sức khỏe
     *      (DOCTOR hoặc PATIENT) nhưng cũng có thể giữ ADMIN cùng lúc.
     *      Mapping lồng giữ việc tra cứu ở O(1) và tránh các vòng lặp
     *      mảng tốn kém.
     */
    mapping(address => mapping(bytes32 => bool)) private _roles;

    // Sự Kiện

    /// @notice Phát hành bất cứ khi nào một vai trò được cấp cho một ví.
    /// @param wallet   Địa chỉ Ethereum nhận vai trò.
    /// @param role     Định danh `bytes32` vai trò đã được cấp.
    /// @param sender   Địa chỉ kích hoạt việc cấp (hoặc address(0) trong constructor).
    event RoleGranted(address indexed wallet, bytes32 indexed role, address indexed sender);

    /// @notice Phát hành bất cứ khi nào một vai trò bị thu hồi từ một ví.
    /// @param wallet   Địa chỉ Ethereum mà vai trò bị xóa.
    /// @param role     Định danh `bytes32` vai trò đã bị thu hồi.
    /// @param sender   Địa chỉ admin kích hoạt việc thu hồi.
    event RoleRevoked(address indexed wallet, bytes32 indexed role, address indexed sender);

    // Lỗi Tùy Chỉnh (rẻ hơn so với revert strings)
    // -------------------------------------------------------------------------

    /// @dev Được ném khi người gọi không giữ vai trò ADMIN.
    error NotAdmin();

    /// @dev Được ném khi địa chỉ không (0x0) được cung cấp nơi không được phép.
    error ZeroAddress();

    /// @dev Được ném khi cố gắng đăng ký một địa chỉ đã giữ vai trò đích.
    error AlreadyRegistered(address wallet, bytes32 role);

    /// @dev Được ném khi cố gắng thu hồi một vai trò mà địa chỉ không giữ.
    error RoleNotFound(address wallet, bytes32 role);
    // Constructor
    /**
     * @notice Triển khai sổ đăng ký và ngay lập tức cấp vai trò ADMIN cho
     *         người triển khai để hệ thống có một bootstrapper có đặc quyền.
     * @dev    `address(0)` được truyền dưới dạng `sender` để báo hiệu
     *         việc cấp quyền sáng tạo trên chuỗi mà không có người gọi —
     *         nhất quán với cách OpenZeppelin AccessControl xử lý các
     *         gán vai trò trong constructor.
     */
    constructor() {
        _roles[msg.sender][ADMIN] = true;
        emit RoleGranted(msg.sender, ADMIN, address(0));
    }
    // Modifier
    /**
     * @dev Hoàn tác với `NotAdmin` nếu người gọi không giữ vai trò ADMIN.
     *      Được sử dụng trên mọi hàm thay đổi trạng thái admin.
     */
    modifier onlyAdmin() {
        if (!_roles[msg.sender][ADMIN]) revert NotAdmin();
        _;
    }
    // Bên Ngoài — Quản Lý Vai Trò
    /**
     * @notice Đăng ký địa chỉ ví như một BÁC SĨ.
     * @dev    Chỉ có thể gọi bởi một địa chỉ giữ vai trò ADMIN.
     *         Hoàn tác nếu:
     *           • `_doctorWallet` là địa chỉ không.
     *           • `_doctorWallet` đã giữ vai trò DOCTOR.
     * @param _doctorWallet Địa chỉ ví được cấp vai trò DOCTOR.
     */
    function registerDoctor(address _doctorWallet) external onlyAdmin {
        _requireNonZero(_doctorWallet);
        if (_roles[_doctorWallet][DOCTOR]) revert AlreadyRegistered(_doctorWallet, DOCTOR);

        _roles[_doctorWallet][DOCTOR] = true;
        emit RoleGranted(_doctorWallet, DOCTOR, msg.sender);
    }
    /**
     * @notice Đăng ký địa chỉ ví như một BỆNH NHÂN.
     * @dev    Chỉ có thể gọi bởi một địa chỉ giữ vai trò ADMIN.
     *         Hoàn tác nếu:
     *           • `_patientWallet` là địa chỉ không.
     *           • `_patientWallet` đã giữ vai trò PATIENT.
     * @param _patientWallet Địa chỉ ví được cấp vai trò PATIENT.
     */
    function registerPatient(address _patientWallet) external onlyAdmin {
        _requireNonZero(_patientWallet);
        if (_roles[_patientWallet][PATIENT]) revert AlreadyRegistered(_patientWallet, PATIENT);

        _roles[_patientWallet][PATIENT] = true;
        emit RoleGranted(_patientWallet, PATIENT, msg.sender);
    }
    /**
     * @notice Cấp vai trò ADMIN cho một địa chỉ ví khác.
     * @dev    Chỉ có thể gọi bởi một ADMIN hiện tại. Cho phép ủy quyền
     *         admin ngang hàng — hữu ích cho các thiết lập multi-sig hoặc
     *         xoay phím.
     *         Hoàn tác nếu:
     *           • `_newAdmin` là địa chỉ không.
     *           • `_newAdmin` đã giữ vai trò ADMIN.
     * @param _newAdmin Địa chỉ ví được nâng cấp lên ADMIN.
     */
    function grantAdmin(address _newAdmin) external onlyAdmin {
        _requireNonZero(_newAdmin);
        if (_roles[_newAdmin][ADMIN]) revert AlreadyRegistered(_newAdmin, ADMIN);

        _roles[_newAdmin][ADMIN] = true;
        emit RoleGranted(_newAdmin, ADMIN, msg.sender);
    }
    /**
     * @notice Thu hồi một vai trò cụ thể từ một địa chỉ ví.
     * @dev    Chỉ có thể gọi bởi một địa chỉ giữ vai trò ADMIN.
     *         Hoàn tác nếu:
     *           • `_wallet` là địa chỉ không.
     *           • `_wallet` hiện không giữ `_role`.
     *         Lưu ý: Một admin có thể thu hồi vai trò ADMIN của chính họ.
     *         Triển khai với multi-sig hoặc thêm bảo vệ `minAdmins` trong
     *         sản xuất nếu cần thiết.
     * @param _wallet Địa chỉ từ đó vai trò sẽ bị xóa.
     * @param _role   Hằng số vai trò `bytes32` (ADMIN, DOCTOR hoặc PATIENT).
     */
    function revokeRole(address _wallet, bytes32 _role) external onlyAdmin {
        _requireNonZero(_wallet);
        if (!_roles[_wallet][_role]) revert RoleNotFound(_wallet, _role);

        _roles[_wallet][_role] = false;
        emit RoleRevoked(_wallet, _role, msg.sender);
    }
    // Bên Ngoài — Xem / Truy Vấn
    /**
     * @notice Kiểm tra xem một ví có giữ một vai trò cụ thể không.
     * @dev    Chế độ xem thuần túy — không thay đổi trạng thái, không có sự kiện.
     *         Được thiết kế để được gọi bởi các hợp đồng VNmedID khác
     *         (ví dụ: MedicalRecord.sol) để gating truy cập mà không lặp lại
     *         logic lưu trữ vai trò.
     * @param _wallet Địa chỉ cần truy vấn.
     * @param _role   Hằng số vai trò `bytes32` để kiểm tra.
     * @return        `true` nếu ví giữ vai trò, `false` ngược lại.
     */
    function checkRole(address _wallet, bytes32 _role) external view returns (bool) {
        return _roles[_wallet][_role];
    }
    /**
     * @notice Trả về trạng thái ADMIN của địa chỉ gọi.
     * @dev    Trợ giúp tiện lợi cho các ứng dụng dApp front-end; tương đương
     *         với `checkRole(msg.sender, ADMIN)`.
     * @return `true` nếu người gọi là ADMIN.
     */
    function isAdmin() external view returns (bool) {
        return _roles[msg.sender][ADMIN];
    }
    // Trợ Giúp Nội Bộ
    /**
     * @dev Hoàn tác với `ZeroAddress` nếu `_addr` là địa chỉ không.
     *      Được trích xuất thành một hàm riêng để tránh lặp lại bytecode
     *      trên bốn điểm vào công khai (tiết kiệm ~30–60 gas mỗi lệnh gọi).
     * @param _addr Địa chỉ để xác thực.
     */
    function _requireNonZero(address _addr) private pure {
        if (_addr == address(0)) revert ZeroAddress();
    }
}
