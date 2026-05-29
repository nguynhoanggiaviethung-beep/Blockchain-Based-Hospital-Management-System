// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Interface BE/FE yêu cầu
interface IVNmedID {
    struct AccessLog {
        address doctorWallet;
        bool isAllowed;
        uint256 timestamp;
    }

    struct MedicalRecord {
        string recordHash;
        uint256 timestamp;
    }

    event AccessGranted(string indexed patientId, address indexed doctorWallet, uint256 timestamp);
    event AccessRevoked(string indexed patientId, address indexed doctorWallet, uint256 timestamp);
    event RecordAdded(string indexed patientId, string recordHash, uint256 timestamp);
    event PaymentRecorded(string indexed invoiceId, address indexed patientWallet, uint256 amount, uint256 timestamp);

    function grantAccess(string calldata _patientId, address _doctorWallet) external;
    function revokeAccess(string calldata _patientId, address _doctorWallet) external;
    function checkPermission(string calldata _patientId, address _doctorWallet) external view returns (bool);
    function addRecordHash(string calldata _patientId, string calldata _recordHash) external;
    function getRecordHashes(string calldata _patientId) external view returns (string[] memory);
    function payInvoice(string calldata _invoiceId) external payable;
}

contract VNmedID_Core is IVNmedID {
    
    address public backendAdmin; // ví deploy code

    // patientId => doctorWallet => status (cấp quyền)
    mapping(string => mapping(address => bool)) private doctorAccess;

    // patientId => mảng IPFS hash (lưu bệnh án)
    mapping(string => string[]) private patientRecords;

    modifier onlyAdmin() {
        require(msg.sender == backendAdmin, "Not Admin");
        _;
    }

    constructor() {
        backendAdmin = msg.sender;
    }

    function grantAccess(string calldata _patientId, address _doctorWallet) external override onlyAdmin {
        require(!doctorAccess[_patientId][_doctorWallet], "Already granted");
        
        doctorAccess[_patientId][_doctorWallet] = true;
        emit AccessGranted(_patientId, _doctorWallet, block.timestamp);
    }

    function revokeAccess(string calldata _patientId, address _doctorWallet) external override onlyAdmin {
        require(doctorAccess[_patientId][_doctorWallet], "No access to revoke");
        
        doctorAccess[_patientId][_doctorWallet] = false;
        emit AccessRevoked(_patientId, _doctorWallet, block.timestamp);
    }

    function checkPermission(string calldata _patientId, address _doctorWallet) external view override returns (bool) {
        return doctorAccess[_patientId][_doctorWallet];
    }

    function addRecordHash(string calldata _patientId, string calldata _recordHash) external override onlyAdmin {
        patientRecords[_patientId].push(_recordHash);
        emit RecordAdded(_patientId, _recordHash, block.timestamp);
    }

    function getRecordHashes(string calldata _patientId) external view override returns (string[] memory) {
        return patientRecords[_patientId];
    }
}