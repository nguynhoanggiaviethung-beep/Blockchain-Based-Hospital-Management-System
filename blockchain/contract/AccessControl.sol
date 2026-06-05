// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VNmedID_Core {
    address public admin;

    // patientId => doctorWallet => permission status
    mapping(string => mapping(address => bool)) public doctorAccess;

    // patientId => list of medical record hashes
    mapping(string => string[]) private medicalRecords;

    event AccessGranted(
        string patientId,
        address doctorWallet,
        uint256 timestamp
    );

    event AccessRevoked(
        string patientId,
        address doctorWallet,
        uint256 timestamp
    );

    event RecordAdded(
        string patientId,
        address doctorWallet,
        string recordHash,
        uint256 timestamp
    );

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can do this action");
        _;
    }

    modifier onlyAuthorizedDoctor(string memory patientId) {
        require(
            doctorAccess[patientId][msg.sender] == true,
            "Doctor does not have permission"
        );
        _;
    }

    // Admin grants access to a doctor for a specific patient
    function grantAccess(
        string memory patientId,
        address doctorWallet
    ) public onlyAdmin {
        require(doctorWallet != address(0), "Invalid doctor address");

        doctorAccess[patientId][doctorWallet] = true;

        emit AccessGranted(patientId, doctorWallet, block.timestamp);
    }

    // Admin revokes access from a doctor
    function revokeAccess(
        string memory patientId,
        address doctorWallet
    ) public onlyAdmin {
        doctorAccess[patientId][doctorWallet] = false;

        emit AccessRevoked(patientId, doctorWallet, block.timestamp);
    }

    // Anyone can check whether a doctor has permission or not
    function checkPermission(
        string memory patientId,
        address doctorWallet
    ) public view returns (bool) {
        return doctorAccess[patientId][doctorWallet];
    }

    // Doctor checks his/her own permission
    function checkMyPermission(
        string memory patientId
    ) public view returns (bool) {
        return doctorAccess[patientId][msg.sender];
    }

    // Only authorized doctor can add a medical record hash
    function addRecordHash(
        string memory patientId,
        string memory recordHash
    ) public onlyAuthorizedDoctor(patientId) {
        require(bytes(recordHash).length > 0, "Record hash cannot be empty");

        medicalRecords[patientId].push(recordHash);

        emit RecordAdded(
            patientId,
            msg.sender,
            recordHash,
            block.timestamp
        );
    }

    // Only authorized doctor can view medical record hashes
    function getRecordHashes(
        string memory patientId
    ) public view onlyAuthorizedDoctor(patientId) returns (string[] memory) {
        return medicalRecords[patientId];
    }
}