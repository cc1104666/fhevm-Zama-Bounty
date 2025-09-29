// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Hello FHEVM - Your First Encrypted Counter
/// @author Zama Community Tutorial
/// @notice A beginner-friendly example showing encrypted arithmetic operations on blockchain
/// @dev This contract demonstrates basic FHEVM operations: encryption, computation, and decryption
contract HelloFHEVM is SepoliaConfig {
    // Encrypted counter - stored on-chain but always encrypted!
    euint32 private _counter;
    
    // Track the owner for decryption permissions
    address public owner;
    
    // Events to track operations (values remain encrypted)
    event CounterUpdated(address indexed user, string operation);
    event CounterReset(address indexed user);
    event PermissionGranted(address indexed user);
    
    /// @notice Initialize the contract with an encrypted zero counter
    constructor() {
        owner = msg.sender;
        // Initialize counter to encrypted zero
        _counter = FHE.asEuint32(0);
        
        // Grant permissions to the contract and owner
        FHE.allowThis(_counter);
        FHE.allow(_counter, owner);
        
        emit CounterUpdated(msg.sender, "initialized");
    }
    
    /// @notice Get the encrypted counter value
    /// @return The encrypted counter (only authorized users can decrypt)
    /// @dev The returned value is encrypted - use FHEVM client to decrypt if authorized
    function getCounter() external view returns (euint32) {
        return _counter;
    }
    
    /// @notice Add an encrypted value to the counter
    /// @param encryptedValue The encrypted value to add (created by FHEVM client)
    /// @param inputProof Cryptographic proof that the encrypted value is valid
    /// @dev This function performs encrypted addition without revealing the operands or result
    function add(externalEuint32 encryptedValue, bytes calldata inputProof) external {
        // Convert external encrypted input to internal format
        // This validates the proof and ensures the encrypted value is legitimate
        euint32 value = FHE.fromExternal(encryptedValue, inputProof);
        
        // Perform encrypted addition - the magic of FHE!
        // Neither the current counter value nor the input value is ever decrypted
        _counter = FHE.add(_counter, value);
        
        // Grant permissions to decrypt the result
        FHE.allowThis(_counter);
        FHE.allow(_counter, owner);
        FHE.allow(_counter, msg.sender); // Allow the user who performed the operation
        
        emit CounterUpdated(msg.sender, "add");
    }
    
    /// @notice Subtract an encrypted value from the counter
    /// @param encryptedValue The encrypted value to subtract
    /// @param inputProof Proof that the encrypted value is valid
    /// @dev Performs encrypted subtraction - result may underflow in encrypted space
    function subtract(externalEuint32 encryptedValue, bytes calldata inputProof) external {
        euint32 value = FHE.fromExternal(encryptedValue, inputProof);
        
        // Encrypted subtraction
        _counter = FHE.sub(_counter, value);
        
        // Grant permissions
        FHE.allowThis(_counter);
        FHE.allow(_counter, owner);
        FHE.allow(_counter, msg.sender);
        
        emit CounterUpdated(msg.sender, "subtract");
    }
    
    /// @notice Multiply the counter by an encrypted value
    /// @param encryptedValue The encrypted multiplier
    /// @param inputProof Proof that the encrypted value is valid
    /// @dev Demonstrates encrypted multiplication operations
    function multiply(externalEuint32 encryptedValue, bytes calldata inputProof) external {
        euint32 value = FHE.fromExternal(encryptedValue, inputProof);
        
        // Encrypted multiplication
        _counter = FHE.mul(_counter, value);
        
        // Grant permissions
        FHE.allowThis(_counter);
        FHE.allow(_counter, owner);
        FHE.allow(_counter, msg.sender);
        
        emit CounterUpdated(msg.sender, "multiply");
    }
    
    /// @notice Reset counter to zero (only owner)
    /// @dev Useful for demo purposes and testing
    function reset() external {
        require(msg.sender == owner, "Only owner can reset");
        
        _counter = FHE.asEuint32(0);
        FHE.allowThis(_counter);
        FHE.allow(_counter, owner);
        
        emit CounterReset(msg.sender);
    }
    
    /// @notice Grant decryption permission to a specific address
    /// @param user The address to grant permission to
    /// @dev Only owner can grant permissions
    function grantPermission(address user) external {
        require(msg.sender == owner, "Only owner can grant permissions");
        
        FHE.allow(_counter, user);
        
        emit PermissionGranted(user);
    }
    
    /// @notice Check if the counter is greater than an encrypted threshold
    /// @param encryptedThreshold The encrypted threshold to compare against
    /// @param inputProof Proof for the encrypted threshold
    /// @return An encrypted boolean result (true if counter > threshold)
    /// @dev Demonstrates encrypted comparison operations
    function isGreaterThan(externalEuint32 encryptedThreshold, bytes calldata inputProof) 
        external 
        returns (euint32) 
    {
        euint32 threshold = FHE.fromExternal(encryptedThreshold, inputProof);
        
        // Encrypted comparison - returns encrypted boolean (0 or 1)
        euint32 result = FHE.asEuint32(FHE.gt(_counter, threshold));
        
        // Grant permissions for the result
        FHE.allowThis(result);
        FHE.allow(result, msg.sender);
        
        return result;
    }
    
    /// @notice Get the minimum between counter and an encrypted value
    /// @param encryptedValue The encrypted value to compare with
    /// @param inputProof Proof for the encrypted value
    /// @return The encrypted minimum value
    /// @dev Shows conditional operations on encrypted data
    function min(externalEuint32 encryptedValue, bytes calldata inputProof) 
        external 
        returns (euint32) 
    {
        euint32 value = FHE.fromExternal(encryptedValue, inputProof);
        
        // Encrypted conditional selection
        euint32 result = FHE.select(FHE.lt(_counter, value), _counter, value);
        
        // Grant permissions for the result
        FHE.allowThis(result);
        FHE.allow(result, msg.sender);
        
        return result;
    }
    
    /// @notice Increment counter by 1 (convenience function)
    /// @dev Uses a hardcoded encrypted value of 1
    function increment() external {
        euint32 one = FHE.asEuint32(1);
        _counter = FHE.add(_counter, one);
        
        FHE.allowThis(_counter);
        FHE.allow(_counter, owner);
        FHE.allow(_counter, msg.sender);
        
        emit CounterUpdated(msg.sender, "increment");
    }
    
    /// @notice Decrement counter by 1 (convenience function)
    /// @dev Uses a hardcoded encrypted value of 1
    function decrement() external {
        euint32 one = FHE.asEuint32(1);
        _counter = FHE.sub(_counter, one);
        
        FHE.allowThis(_counter);
        FHE.allow(_counter, owner);
        FHE.allow(_counter, msg.sender);
        
        emit CounterUpdated(msg.sender, "decrement");
    }
}
