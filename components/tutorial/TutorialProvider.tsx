"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  content: string;
  code?: {
    solidity?: string;
    typescript?: string;
    jsx?: string;
  };
  interactive?: boolean;
  completed?: boolean;
}

export interface TutorialExample {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  steps: TutorialStep[];
  demoUrl?: string;
  repoUrl?: string;
}

interface TutorialContextType {
  currentExample: TutorialExample | null;
  currentStepIndex: number;
  examples: TutorialExample[];
  setCurrentExample: (example: TutorialExample) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  markStepCompleted: (stepId: string) => void;
  resetProgress: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}

const TUTORIAL_EXAMPLES: TutorialExample[] = [
  {
    id: 'hello-fhevm',
    title: 'Hello FHEVM - Your First Encrypted Counter',
    description: 'Learn the basics of FHEVM by building a simple encrypted counter that performs private arithmetic operations.',
    difficulty: 'beginner',
    estimatedTime: '30 minutes',
    steps: [
      {
        id: 'intro',
        title: 'Welcome to FHEVM',
        description: 'Understanding Fully Homomorphic Encryption on Ethereum',
        content: `# Welcome to FHEVM! 🚀

**Fully Homomorphic Encryption for Ethereum Virtual Machine (FHEVM)** allows you to perform computations on encrypted data without ever decrypting it. This revolutionary technology enables:

## 🔐 Privacy by Default
- Your data stays encrypted on-chain at all times
- Smart contracts can process private information
- Users maintain complete control over their data

## 🧮 Confidential Computing  
- Perform arithmetic operations on encrypted numbers
- Compare encrypted values without revealing them
- Execute complex logic while preserving privacy

## 🌐 Decentralized Privacy
- No trusted third parties needed
- All operations happen on public blockchain
- Transparency without sacrificing confidentiality

## What You'll Build

In this tutorial, you'll create your first FHEVM dApp - a **private counter** that:

1. ✅ **Stores encrypted numbers** on the blockchain
2. ✅ **Performs encrypted arithmetic** (add, subtract, multiply)
3. ✅ **Controls access** to decryption permissions
4. ✅ **Provides a user-friendly interface** for interaction

## Key Concepts You'll Learn

- **Encrypted Data Types**: \`euint32\`, \`ebool\`, etc.
- **FHE Operations**: \`FHE.add()\`, \`FHE.sub()\`, \`FHE.mul()\`
- **Access Control**: \`FHE.allow()\`, \`FHE.allowThis()\`
- **Input Validation**: Cryptographic proofs for encrypted inputs
- **Client-Side Encryption**: Using the FHEVM SDK

Ready to dive into the future of privacy-preserving smart contracts? Let's get started! 🎯`,
        interactive: false
      },
      {
        id: 'setup-environment',
        title: 'Setting Up Your Development Environment',
        description: 'Install dependencies and configure your workspace',
        content: `# Development Environment Setup

Before we start coding, let's set up everything you need for FHEVM development.

## Prerequisites

Make sure you have these installed:

- **Node.js v20+** - [Download here](https://nodejs.org/)
- **MetaMask Extension** - [Install from Chrome Store](https://metamask.io/)
- **Git** - For cloning repositories
- **Code Editor** - VS Code recommended

## Project Structure

Our tutorial project follows this structure:

\`\`\`
hello-fhevm-tutorial/
├── contracts/              # Solidity smart contracts
│   └── HelloFHEVM.sol     # Our main contract
├── app/                   # Next.js React application
├── components/            # Reusable UI components
├── hooks/                # Custom React hooks
├── deploy/               # Hardhat deployment scripts
├── test/                 # Contract test suites
└── hardhat.config.ts     # Hardhat configuration
\`\`\`

## Key Dependencies

### Smart Contract Development
- **@fhevm/solidity** - Core FHEVM library for Solidity
- **hardhat** - Ethereum development environment
- **@fhevm/hardhat-plugin** - FHEVM integration for Hardhat

### Frontend Development  
- **@zama-fhe/relayer-sdk** - Client-side encryption library
- **ethers.js** - Ethereum interaction library
- **Next.js** - React framework for the frontend

### Development Tools
- **TypeScript** - Type safety for JavaScript
- **Tailwind CSS** - Utility-first CSS framework

## Installation Commands

If you're following along locally, run these commands:

\`\`\`bash
# Clone the tutorial repository
git clone https://github.com/zama-ai/hello-fhevm-tutorial.git
cd hello-fhevm-tutorial

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

## Environment Variables

Create a \`.env.local\` file with these variables:

\`\`\`bash
# For contract deployment (optional)
MNEMONIC="your twelve word mnemonic phrase here"
INFURA_API_KEY="your_infura_project_id"

# For frontend configuration
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL="http://127.0.0.1:8545"
\`\`\`

## Network Configuration

We'll primarily use a **local Hardhat network** for development:

- **Network Name**: Hardhat
- **RPC URL**: http://127.0.0.1:8545  
- **Chain ID**: 31337
- **Currency Symbol**: ETH

Don't worry - we'll walk through MetaMask setup in the next steps!

## Verification

To verify your setup is working:

1. ✅ Node.js version: \`node --version\` (should be v20+)
2. ✅ MetaMask installed and accessible
3. ✅ Project dependencies installed successfully
4. ✅ Development server starts without errors

Ready to write your first FHEVM smart contract? Let's go! 🛠️`,
        interactive: false
      },
      {
        id: 'smart-contract',
        title: 'Writing Your First FHEVM Smart Contract',
        description: 'Create an encrypted counter contract',
        content: `# Building the HelloFHEVM Smart Contract

Now for the exciting part - let's write your first FHEVM smart contract! This contract will demonstrate the core concepts of encrypted computation on Ethereum.

## Contract Overview

Our \`HelloFHEVM\` contract will:
- Store an encrypted counter value
- Allow encrypted arithmetic operations  
- Manage decryption permissions
- Emit events for transparency (without revealing values)

## Key FHEVM Concepts

### Encrypted Data Types
- **\`euint32\`** - Encrypted 32-bit unsigned integer
- **\`ebool\`** - Encrypted boolean
- **\`externalEuint32\`** - External encrypted input from users

### Core FHE Operations
- **\`FHE.add(a, b)\`** - Add two encrypted numbers
- **\`FHE.sub(a, b)\`** - Subtract encrypted numbers
- **\`FHE.mul(a, b)\`** - Multiply encrypted numbers
- **\`FHE.asEuint32(x)\`** - Convert plaintext to encrypted

### Access Control
- **\`FHE.allowThis(value)\`** - Allow contract to use encrypted value
- **\`FHE.allow(value, address)\`** - Grant decryption permission to address

## The Smart Contract

Here's our complete HelloFHEVM contract. Try modifying it in the code editor!`,
        code: {
          solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Hello FHEVM - Your First Encrypted Counter
/// @notice A beginner-friendly example showing encrypted arithmetic operations
contract HelloFHEVM is SepoliaConfig {
    // Encrypted counter - stored on-chain but always encrypted!
    euint32 private _counter;
    
    // Track the owner for decryption permissions
    address public owner;
    
    // Events to track operations (values remain encrypted)
    event CounterUpdated(address indexed user, string operation);
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
    function getCounter() external view returns (euint32) {
        return _counter;
    }
    
    /// @notice Add an encrypted value to the counter
    /// @param encryptedValue The encrypted value to add
    /// @param inputProof Cryptographic proof that the encrypted value is valid
    function add(externalEuint32 encryptedValue, bytes calldata inputProof) external {
        // Convert external encrypted input to internal format
        euint32 value = FHE.fromExternal(encryptedValue, inputProof);
        
        // Perform encrypted addition - the magic of FHE!
        _counter = FHE.add(_counter, value);
        
        // Grant permissions to decrypt the result
        FHE.allowThis(_counter);
        FHE.allow(_counter, owner);
        FHE.allow(_counter, msg.sender);
        
        emit CounterUpdated(msg.sender, "add");
    }
    
    /// @notice Subtract an encrypted value from the counter
    /// @param encryptedValue The encrypted value to subtract
    /// @param inputProof Proof that the encrypted value is valid
    function subtract(externalEuint32 encryptedValue, bytes calldata inputProof) external {
        euint32 value = FHE.fromExternal(encryptedValue, inputProof);
        
        // Encrypted subtraction
        _counter = FHE.sub(_counter, value);
        
        FHE.allowThis(_counter);
        FHE.allow(_counter, owner);
        FHE.allow(_counter, msg.sender);
        
        emit CounterUpdated(msg.sender, "subtract");
    }
    
    /// @notice Increment counter by 1 (convenience function)
    function increment() external {
        euint32 one = FHE.asEuint32(1);
        _counter = FHE.add(_counter, one);
        
        FHE.allowThis(_counter);
        FHE.allow(_counter, owner);
        FHE.allow(_counter, msg.sender);
        
        emit CounterUpdated(msg.sender, "increment");
    }
    
    /// @notice Decrement counter by 1 (convenience function)
    function decrement() external {
        euint32 one = FHE.asEuint32(1);
        _counter = FHE.sub(_counter, one);
        
        FHE.allowThis(_counter);
        FHE.allow(_counter, owner);
        FHE.allow(_counter, msg.sender);
        
        emit CounterUpdated(msg.sender, "decrement");
    }
    
    /// @notice Reset counter to zero (only owner)
    function reset() external {
        require(msg.sender == owner, "Only owner can reset");
        
        _counter = FHE.asEuint32(0);
        FHE.allowThis(_counter);
        FHE.allow(_counter, owner);
        
        emit CounterUpdated(msg.sender, "reset");
    }
    
    /// @notice Grant decryption permission to a specific address
    /// @param user The address to grant permission to
    function grantPermission(address user) external {
        require(msg.sender == owner, "Only owner can grant permissions");
        
        FHE.allow(_counter, user);
        
        emit PermissionGranted(user);
    }
}`
        },
        interactive: true
      },
      {
        id: 'frontend-setup',
        title: 'Building the Frontend Interface',
        description: 'Create a React interface to interact with your contract',
        content: `# Creating the Frontend Interface

Now let's build a beautiful, user-friendly interface to interact with our encrypted counter! We'll create a React component that handles encryption, transactions, and decryption.

## Frontend Architecture

Our frontend will consist of:

### Core Components
- **FHEVM Instance Management** - Handle encryption/decryption
- **Wallet Connection** - Connect to MetaMask
- **Contract Interaction** - Send encrypted transactions
- **User Interface** - Display counter and controls

### Key Features
1. **🔌 Wallet Integration** - Connect MetaMask seamlessly
2. **🔐 Client-Side Encryption** - Encrypt user inputs before sending
3. **📡 Real-Time Updates** - Show transaction status and results
4. **🎨 Beautiful UI** - Clean, intuitive interface

## The Frontend Component

Here's our complete React component. You can modify the code to see how it works!`,
        code: {
          jsx: `"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { createFhevmInstance } from '@zama-fhe/relayer-sdk';

// Contract ABI (simplified for demo)
const HELLO_FHEVM_ABI = [
  "function getCounter() view returns (uint256)",
  "function add(uint256 encryptedValue, bytes calldata inputProof)",
  "function subtract(uint256 encryptedValue, bytes calldata inputProof)", 
  "function increment()",
  "function decrement()",
  "function reset()",
  "event CounterUpdated(address indexed user, string operation)"
];

export function HelloFHEVMDemo() {
  // State management
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [fhevmInstance, setFhevmInstance] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const [counterValue, setCounterValue] = useState('0');
  const [inputValue, setInputValue] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Welcome to Hello FHEVM!');
  const [userAddress, setUserAddress] = useState('');

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setMessage('Please install MetaMask!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setUserAddress(address);
      setIsConnected(true);
      setMessage('Wallet connected successfully!');

      // Initialize FHEVM instance
      const instance = await createFhevmInstance({
        chainId: 31337, // Local Hardhat network
        publicKeyProvider: provider
      });
      setFhevmInstance(instance);

      // Initialize contract
      const contractAddress = "0x..."; // Your deployed contract address
      const contract = new ethers.Contract(contractAddress, HELLO_FHEVM_ABI, signer);
      setContract(contract);

      // Load initial counter value
      await refreshCounter();

    } catch (error) {
      setMessage('Failed to connect wallet: ' + error.message);
    }
  };

  // Refresh counter value
  const refreshCounter = async () => {
    if (!contract || !fhevmInstance || !signer) return;
    
    try {
      setMessage('Loading counter value...');
      
      // Get encrypted counter from contract
      const encryptedCounter = await contract.getCounter();
      
      // Decrypt the counter (only works if user has permission)
      const decryptedValue = await fhevmInstance.decrypt(
        encryptedCounter,
        await signer.getAddress()
      );
      
      setCounterValue(decryptedValue.toString());
      setMessage('Counter value updated!');
    } catch (error) {
      console.error('Failed to decrypt counter:', error);
      setCounterValue('Encrypted');
      setMessage('Counter is encrypted - only authorized users can decrypt');
    }
  };

  // Add encrypted value to counter
  const handleAdd = async () => {
    if (!fhevmInstance || !contract || !signer) return;
    
    setIsLoading(true);
    setMessage('Encrypting your input...');
    
    try {
      // Create encrypted input
      const input = fhevmInstance.createEncryptedInput(
        await contract.getAddress(),
        await signer.getAddress()
      );
      
      // Add the value to encrypt
      input.add32(parseInt(inputValue));
      
      // Encrypt the input
      const encryptedInput = await input.encrypt();
      
      setMessage('Sending encrypted transaction...');
      
      // Send encrypted transaction
      const tx = await contract.add(
        encryptedInput.handles[0],
        encryptedInput.inputProof
      );
      
      setMessage('Waiting for confirmation...');
      await tx.wait();
      
      setMessage(\`Successfully added \${inputValue} to counter!\`);
      
      // Refresh counter display
      await refreshCounter();
      
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Subtract encrypted value from counter
  const handleSubtract = async () => {
    if (!fhevmInstance || !contract || !signer) return;
    
    setIsLoading(true);
    setMessage('Encrypting your input...');
    
    try {
      const input = fhevmInstance.createEncryptedInput(
        await contract.getAddress(),
        await signer.getAddress()
      );
      
      input.add32(parseInt(inputValue));
      const encryptedInput = await input.encrypt();
      
      setMessage('Sending encrypted transaction...');
      
      const tx = await contract.subtract(
        encryptedInput.handles[0],
        encryptedInput.inputProof
      );
      
      setMessage('Waiting for confirmation...');
      await tx.wait();
      
      setMessage(\`Successfully subtracted \${inputValue} from counter!\`);
      await refreshCounter();
      
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Increment by 1
  const handleIncrement = async () => {
    if (!contract) return;
    
    setIsLoading(true);
    setMessage('Incrementing counter...');
    
    try {
      const tx = await contract.increment();
      await tx.wait();
      
      setMessage('Counter incremented by 1!');
      await refreshCounter();
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Decrement by 1
  const handleDecrement = async () => {
    if (!contract) return;
    
    setIsLoading(true);
    setMessage('Decrementing counter...');
    
    try {
      const tx = await contract.decrement();
      await tx.wait();
      
      setMessage('Counter decremented by 1!');
      await refreshCounter();
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset counter (only owner)
  const handleReset = async () => {
    if (!contract) return;
    
    setIsLoading(true);
    setMessage('Resetting counter...');
    
    try {
      const tx = await contract.reset();
      await tx.wait();
      
      setMessage('Counter reset to 0!');
      await refreshCounter();
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Connect Your Wallet
        </h2>
        <p className="text-gray-600 mb-6">
          Connect MetaMask to interact with the HelloFHEVM contract
        </p>
        <button 
          onClick={connectWallet}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Connect MetaMask
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Hello FHEVM Counter 🔒
          </h1>
          <p className="opacity-90">
            Your first encrypted smart contract in action
          </p>
        </div>
        
        {/* Counter Display */}
        <div className="p-8 text-center border-b">
          <div className="text-6xl font-mono font-bold text-blue-600 mb-4">
            {counterValue}
          </div>
          <p className="text-gray-600 text-lg">Current Counter Value</p>
          <p className="text-sm text-gray-500 mt-2">
            Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          </p>
        </div>
        
        {/* Controls */}
        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="flex gap-4">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a number"
              min="1"
              disabled={isLoading}
            />
            <button
              onClick={handleAdd}
              disabled={isLoading}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
            <button
              onClick={handleSubtract}
              disabled={isLoading}
              className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Subtract
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={handleIncrement}
              disabled={isLoading}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              +1
            </button>
            <button
              onClick={handleDecrement}
              disabled={isLoading}
              className="px-4 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 transition-colors"
            >
              -1
            </button>
            <button
              onClick={refreshCounter}
              disabled={isLoading}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              Reset
            </button>
          </div>
          
          {/* Status Message */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 flex items-center">
              {isLoading && (
                <div className="spinner mr-2"></div>
              )}
              {message}
            </p>
          </div>
          
          {/* Educational Info */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              🔍 What's Happening Behind the Scenes?
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Your input numbers are encrypted before sending to blockchain</li>
              <li>• All arithmetic operations happen on encrypted data</li>
              <li>• Only authorized users can decrypt and view the results</li>
              <li>• The blockchain never sees your raw numbers - complete privacy!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}`
        },
        interactive: true
      },
      {
        id: 'deployment',
        title: 'Deploying and Testing Your dApp',
        description: 'Deploy your contract and test the full application',
        content: `# Deploying Your HelloFHEVM dApp

Congratulations! You've built your first complete FHEVM application. Now let's deploy it and see everything working together.

## Deployment Options

### 1. Local Development (Recommended for Learning)
- **Fast iteration** - Deploy and test quickly
- **No gas costs** - Perfect for experimentation  
- **Full control** - Restart anytime

### 2. Zama Testnet
- **Realistic environment** - Test with real FHEVM infrastructure
- **Community testing** - Share with other developers
- **Production-like** - Closer to mainnet experience

## Step-by-Step Deployment

### Local Deployment

1. **Start Hardhat Node**
   \`\`\`bash
   npm run hardhat-node
   \`\`\`
   This creates a local blockchain at \`http://127.0.0.1:8545\`

2. **Deploy Contract**
   \`\`\`bash
   npm run deploy:local
   \`\`\`
   Your contract will be deployed and the address saved

3. **Configure MetaMask**
   - Network Name: \`Hardhat\`
   - RPC URL: \`http://127.0.0.1:8545\`
   - Chain ID: \`31337\`
   - Currency: \`ETH\`

4. **Import Test Account**
   Use one of the test accounts from Hardhat node output

### Testnet Deployment

1. **Get Test ETH**
   - Visit the Zama Testnet faucet
   - Request test tokens for deployment

2. **Deploy to Testnet**
   \`\`\`bash
   npm run deploy:sepolia
   \`\`\`

3. **Verify Contract**
   The deployment script automatically verifies on Etherscan

## Testing Your dApp

### Basic Functionality Tests

✅ **Wallet Connection**
- Connect MetaMask successfully
- See your address displayed
- FHEVM instance initializes

✅ **Counter Operations**
- Add encrypted numbers to counter
- Subtract encrypted values
- Use increment/decrement shortcuts
- Reset counter (owner only)

✅ **Privacy Features**
- Input values are encrypted before sending
- Counter value stays encrypted on-chain
- Only authorized users can decrypt results

### Advanced Testing Scenarios

🔬 **Multi-User Testing**
1. Connect with different accounts
2. Perform operations from each account
3. Test permission system
4. Verify decryption access control

🔬 **Error Handling**
- Try operations without wallet connection
- Test with invalid inputs
- Attempt unauthorized operations
- Check network switching

🔬 **Performance Testing**
- Measure encryption time for different input sizes
- Test with multiple concurrent operations
- Monitor gas usage patterns

## Understanding the Flow

### 1. User Input Encryption
\`\`\`
User Input → FHEVM SDK → Encrypted Value + Proof
\`\`\`

### 2. Transaction Submission
\`\`\`
Encrypted Value → Smart Contract → FHE Operation → Encrypted Result
\`\`\`

### 3. Result Decryption
\`\`\`
Encrypted Result → FHEVM SDK → Decrypted Value (if authorized)
\`\`\`

## Troubleshooting Common Issues

### ❌ "Transaction Failed"
- **Check gas limits** - FHE operations need more gas
- **Verify network** - Ensure you're on the right chain
- **Confirm balance** - Make sure you have enough ETH

### ❌ "Decryption Failed"  
- **Permission check** - Only authorized addresses can decrypt
- **Network sync** - Wait for transaction confirmation
- **FHEVM instance** - Ensure instance is properly initialized

### ❌ "MetaMask Connection Issues"
- **Clear cache** - Reset MetaMask account activity
- **Network switch** - Manually switch to correct network
- **Restart browser** - Fresh start often helps

## 🎉 Success! You Did It!

You've successfully:

- ✅ **Written** your first FHEVM smart contract
- ✅ **Built** a React frontend with encryption
- ✅ **Deployed** to blockchain network  
- ✅ **Tested** end-to-end functionality
- ✅ **Learned** core FHEVM concepts

## What's Next?

Ready for more advanced FHEVM development? Try these next steps:

### 🗳️ **Private Voting System**
- Cast encrypted votes
- Tally results without revealing individual choices
- Implement voting deadlines and access control

### 🏺 **Secret Auction House**
- Submit sealed bids
- Compare encrypted bid amounts
- Reveal winner without exposing losing bids

### 🎮 **Number Guessing Game**
- Hide target number with encryption
- Allow encrypted guesses
- Provide feedback without revealing the target

### 🏦 **Private Token Transfers**
- Transfer amounts privately
- Maintain encrypted balances
- Implement confidential payment systems

## Community & Resources

- 📚 **Documentation**: [docs.zama.ai](https://docs.zama.ai)
- 💬 **Discord Community**: [discord.gg/zama](https://discord.gg/zama)
- 🐙 **GitHub Examples**: [github.com/zama-ai](https://github.com/zama-ai)
- 🎓 **Advanced Tutorials**: Coming soon!

Welcome to the future of privacy-preserving smart contracts! 🚀`,
        interactive: false
      }
    ]
  },
  {
    id: 'private-voting',
    title: 'Private Voting System',
    description: 'Build a confidential voting dApp where votes are encrypted and only final tallies are revealed.',
    difficulty: 'intermediate',
    estimatedTime: '45 minutes',
    steps: [
      {
        id: 'voting-intro',
        title: 'Introduction to Private Voting',
        description: 'Understanding confidential voting systems and their importance',
        content: `# Private Voting with FHEVM 🗳️

Welcome to the **intermediate** FHEVM tutorial! Now that you understand the basics, let's build something more complex: a **private voting system**.

## 🎯 What We're Building

A confidential voting dApp that ensures:
- **Secret Ballots**: Individual votes remain private
- **Transparent Results**: Final tallies are publicly verifiable
- **Access Control**: Only authorized voters can participate
- **Time-Bound Voting**: Voting periods with clear start/end times

## 🔐 Privacy Guarantees

### Traditional Voting Problems
- **Vote Buying**: Voters can prove how they voted
- **Coercion**: Voters can be forced to vote a certain way
- **Privacy Leaks**: Individual preferences are exposed

### FHEVM Solutions
- **Encrypted Votes**: Votes are encrypted before submission
- **Private Tallying**: Counting happens on encrypted data
- **Selective Disclosure**: Only final results are revealed
- **Cryptographic Proofs**: Votes are valid without revealing content

## 🏗️ System Architecture

### Smart Contract Components
1. **Proposal Management**: Create and manage voting proposals
2. **Voter Authorization**: Control who can participate
3. **Encrypted Voting**: Cast votes using FHE encryption
4. **Private Tallying**: Count votes without revealing individual choices
5. **Result Revelation**: Decrypt and publish final results

Ready to build the future of democratic participation? Let's start! 🚀`,
        interactive: false
      },
      {
        id: 'voting-contract',
        title: 'Building the Private Voting Contract',
        description: 'Create a smart contract for confidential voting',
        content: `# Creating the PrivateVoting Smart Contract

Let's build a sophisticated voting system that maintains voter privacy while ensuring result transparency.

## 🔐 Privacy-Preserving Mechanisms

### Encrypted Vote Storage
\`\`\`solidity
struct EncryptedVote {
    euint32 proposalId;
    ebool vote;        // true for yes, false for no
    bool hasVoted;
}
\`\`\`

### Private Vote Counting
\`\`\`solidity
// Add encrypted vote to appropriate counter
proposals[id].yesVotes = FHE.add(
    proposals[id].yesVotes,
    FHE.select(vote, one, FHE.asEuint32(0))
);
\`\`\`

Let's examine the complete contract implementation:`,
        code: {
          solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32, ebool, externalEbool} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Private Voting System
/// @notice A confidential voting system where individual votes remain private
contract PrivateVoting is SepoliaConfig {
    struct Proposal {
        string description;
        euint32 yesVotes;     // Encrypted yes vote count
        euint32 noVotes;      // Encrypted no vote count
        uint256 startTime;
        uint256 endTime;
        bool exists;
        bool resultsRevealed;
    }
    
    address public admin;
    uint32 public proposalCount;
    mapping(uint32 => Proposal) public proposals;
    mapping(address => mapping(uint32 => bool)) public hasVoted;
    mapping(address => bool) public authorizedVoters;
    
    event ProposalCreated(uint32 indexed proposalId, string description, uint256 startTime, uint256 endTime);
    event VoteCast(address indexed voter, uint32 indexed proposalId);
    event VoterAuthorized(address indexed voter);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        authorizedVoters[admin] = true;
    }
    
    function createProposal(
        string calldata description,
        uint256 durationInSeconds
    ) external onlyAdmin returns (uint32) {
        uint32 proposalId = proposalCount++;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + durationInSeconds;
        
        proposals[proposalId] = Proposal({
            description: description,
            yesVotes: FHE.asEuint32(0),
            noVotes: FHE.asEuint32(0),
            startTime: startTime,
            endTime: endTime,
            exists: true,
            resultsRevealed: false
        });
        
        FHE.allowThis(proposals[proposalId].yesVotes);
        FHE.allowThis(proposals[proposalId].noVotes);
        FHE.allow(proposals[proposalId].yesVotes, admin);
        FHE.allow(proposals[proposalId].noVotes, admin);
        
        emit ProposalCreated(proposalId, description, startTime, endTime);
        return proposalId;
    }
    
    function castVote(
        uint32 proposalId,
        externalEbool encryptedVote,
        bytes calldata voteProof
    ) external {
        require(authorizedVoters[msg.sender], "Not authorized to vote");
        require(proposals[proposalId].exists, "Proposal does not exist");
        require(block.timestamp >= proposals[proposalId].startTime, "Voting not started");
        require(block.timestamp <= proposals[proposalId].endTime, "Voting has ended");
        require(!hasVoted[msg.sender][proposalId], "Already voted");
        
        ebool vote = FHE.fromExternal(encryptedVote, voteProof);
        euint32 one = FHE.asEuint32(1);
        
        proposals[proposalId].yesVotes = FHE.add(
            proposals[proposalId].yesVotes,
            FHE.select(vote, one, FHE.asEuint32(0))
        );
        
        proposals[proposalId].noVotes = FHE.add(
            proposals[proposalId].noVotes,
            FHE.select(vote, FHE.asEuint32(0), one)
        );
        
        FHE.allowThis(proposals[proposalId].yesVotes);
        FHE.allowThis(proposals[proposalId].noVotes);
        FHE.allow(proposals[proposalId].yesVotes, admin);
        FHE.allow(proposals[proposalId].noVotes, admin);
        
        hasVoted[msg.sender][proposalId] = true;
        emit VoteCast(msg.sender, proposalId);
    }
    
    function getVoteCounts(uint32 proposalId) 
        external 
        view 
        returns (euint32 yesVotes, euint32 noVotes) 
    {
        require(proposals[proposalId].exists, "Proposal does not exist");
        return (proposals[proposalId].yesVotes, proposals[proposalId].noVotes);
    }
    
    function authorizeVoter(address voter) external onlyAdmin {
        authorizedVoters[voter] = true;
        emit VoterAuthorized(voter);
    }
}`
        },
        interactive: true
      },
      {
        id: 'voting-frontend',
        title: 'Building the Voting Interface',
        description: 'Create a React frontend for the voting system',
        content: `# Building the Voting Interface

Now let's create a user-friendly interface for our private voting system. This will demonstrate how to handle encrypted boolean inputs and manage complex state.

## 🎨 Interface Components

### Main Features
1. **Proposal List**: Browse all voting proposals
2. **Vote Casting**: Submit encrypted votes with clear UI
3. **Voting Status**: Real-time voting period indicators
4. **Results Display**: Show outcomes when revealed
5. **Admin Panel**: Manage proposals and voters

### User Experience Flow
1. **Connect Wallet** → Verify voter authorization
2. **Browse Proposals** → See active and past votes
3. **Cast Vote** → Choose Yes/No with encryption
4. **View Results** → See tallied outcomes

## 🔐 Encryption Handling

### Boolean Vote Encryption
\`\`\`typescript
// Encrypt boolean vote (true = yes, false = no)
const input = fhevmInstance.createEncryptedInput(contractAddress, userAddress);
input.addBool(voteChoice); // true or false
const encryptedInput = await input.encrypt();
\`\`\`

### Vote Submission
\`\`\`typescript
const tx = await contract.castVote(
  proposalId,
  encryptedInput.handles[0],
  encryptedInput.inputProof
);
\`\`\`

Let's build the complete voting interface:`,
        code: {
          jsx: `"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { createFhevmInstance } from '@zama-fhe/relayer-sdk';

const VOTING_ABI = [
  "function createProposal(string description, uint256 duration) returns (uint32)",
  "function castVote(uint32 proposalId, uint256 encryptedVote, bytes proof)",
  "function getProposal(uint32 id) view returns (string, uint256, uint256, bool)",
  "function getVoteCounts(uint32 id) view returns (uint256, uint256)",
  "function isVotingOpen(uint32 id) view returns (bool)",
  "function authorizeVoter(address voter)",
  "function authorizedVoters(address) view returns (bool)",
  "function hasVoted(address, uint32) view returns (bool)",
  "function proposalCount() view returns (uint32)",
  "event ProposalCreated(uint32 indexed proposalId, string description, uint256 startTime, uint256 endTime)",
  "event VoteCast(address indexed voter, uint32 indexed proposalId)"
];

export function PrivateVotingDemo() {
  // State management
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [fhevmInstance, setFhevmInstance] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Voting state
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [voteChoice, setVoteChoice] = useState(null); // true for yes, false for no
  const [isVoting, setIsVoting] = useState(false);
  const [message, setMessage] = useState('Welcome to Private Voting!');
  
  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [newProposalText, setNewProposalText] = useState('');
  const [proposalDuration, setProposalDuration] = useState(24); // hours

  // Connect wallet and initialize
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setMessage('Please install MetaMask!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setUserAddress(address);
      setIsConnected(true);
      setMessage('Wallet connected successfully!');

      // Initialize FHEVM instance
      const instance = await createFhevmInstance({
        chainId: 31337,
        publicKeyProvider: provider
      });
      setFhevmInstance(instance);

      // Initialize contract
      const contractAddress = "0x..."; // Your deployed contract address
      const contract = new ethers.Contract(contractAddress, VOTING_ABI, signer);
      setContract(contract);

      // Check authorization and load data
      await checkAuthorization(contract, address);
      await loadProposals(contract);

    } catch (error) {
      setMessage('Failed to connect: ' + error.message);
    }
  };

  // Cast encrypted vote
  const castVote = async () => {
    if (!fhevmInstance || !contract || !selectedProposal || voteChoice === null) return;

    setIsVoting(true);
    setMessage('Encrypting your vote...');

    try {
      // Create encrypted input for boolean vote
      const input = fhevmInstance.createEncryptedInput(
        await contract.getAddress(),
        userAddress
      );
      
      // Add boolean vote (true for yes, false for no)
      input.addBool(voteChoice);
      
      // Encrypt the vote
      const encryptedInput = await input.encrypt();
      
      setMessage('Submitting encrypted vote...');
      
      // Submit vote to contract
      const tx = await contract.castVote(
        selectedProposal.id,
        encryptedInput.handles[0],
        encryptedInput.inputProof
      );
      
      setMessage('Waiting for confirmation...');
      await tx.wait();
      
      setMessage(\`Vote cast successfully! You voted \${voteChoice ? 'YES' : 'NO'}\`);
      
      // Reset voting state
      setSelectedProposal(null);
      setVoteChoice(null);
      
      // Refresh proposals
      await loadProposals(contract);
      
    } catch (error) {
      setMessage('Voting failed: ' + error.message);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Private Voting System 🗳️
          </h1>
          <p className="opacity-90">
            Cast confidential votes with full privacy protection
          </p>
        </div>

        {/* Voting Interface */}
        <div className="p-6">
          {selectedProposal ? (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  Voting on Proposal #{selectedProposal.id}
                </h3>
                <p className="text-blue-800 mb-4">{selectedProposal.description}</p>
              </div>

              <div className="text-center">
                <h4 className="text-lg font-semibold mb-4">Cast Your Vote</h4>
                <div className="flex justify-center space-x-4 mb-6">
                  <button
                    onClick={() => setVoteChoice(true)}
                    className={\`px-8 py-4 rounded-lg font-semibold transition-colors \${
                      voteChoice === true
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                    }\`}
                  >
                    👍 YES
                  </button>
                  <button
                    onClick={() => setVoteChoice(false)}
                    className={\`px-8 py-4 rounded-lg font-semibold transition-colors \${
                      voteChoice === false
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                    }\`}
                  >
                    👎 NO
                  </button>
                </div>

                <button
                  onClick={castVote}
                  disabled={voteChoice === null || isVoting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isVoting ? 'Casting Vote...' : 'Submit Encrypted Vote'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold mb-6">Active Proposals</h3>
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900">
                      Proposal #{proposal.id}
                    </h4>
                    <p className="text-gray-700 mt-1">{proposal.description}</p>
                    {proposal.isOpen && (
                      <button
                        onClick={() => setSelectedProposal(proposal)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Vote
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="p-4 bg-purple-50 border-t">
          <h4 className="font-semibold text-purple-800 mb-2">🔒 Privacy Guarantee</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Your vote is encrypted before leaving your device</li>
            <li>• Individual votes remain private throughout the process</li>
            <li>• Only final tallies are revealed after voting ends</li>
            <li>• No one can see how you voted, ensuring ballot secrecy</li>
          </ul>
        </div>
      </div>
    </div>
  );
}`
        },
        interactive: true
      },
      {
        id: 'voting-deployment',
        title: 'Deploying and Testing the Voting System',
        description: 'Deploy the voting contract and test with multiple voters',
        content: `# Deploying and Testing Private Voting

Let's deploy our voting system and test it with multiple participants to see how confidential voting works in practice.

## 🚀 Deployment Process

### 1. Contract Compilation
\`\`\`bash
npx hardhat compile
\`\`\`

### 2. Deploy to Local Network
\`\`\`bash
npx hardhat deploy --network localhost --tags PrivateVoting
\`\`\`

### 3. Verify Deployment
The contract should deploy successfully with:
- ✅ Admin account set to deployer
- ✅ Encrypted vote counters initialized
- ✅ Event emission configured

## 🧪 Testing Scenarios

### Scenario 1: Basic Voting Flow
1. **Admin creates proposal** with 1-hour duration
2. **Admin authorizes voters** (3-5 test accounts)
3. **Voters cast encrypted votes** (mix of yes/no)
4. **Results revealed** after voting period

### Scenario 2: Privacy Verification
1. **Monitor blockchain** during voting period
2. **Verify vote encryption** - individual votes not visible
3. **Check event logs** - only voter addresses visible, not choices
4. **Confirm privacy** until results are decrypted

### Scenario 3: Access Control Testing
1. **Unauthorized voting attempts** should fail
2. **Double voting attempts** should be rejected
3. **Voting outside time bounds** should be blocked
4. **Admin functions** restricted properly

## 📊 Expected Results

### During Voting Period
- Individual vote choices remain completely private
- Only encrypted data stored on blockchain
- Vote counts increment but values are encrypted
- No way to determine individual preferences

### After Results Revelation
- Final tallies become visible
- Individual votes still remain private
- Voting history shows participation, not choices
- System maintains ballot secrecy permanently

## 🔍 Privacy Analysis

### What's Hidden
- ✅ Individual vote choices (yes/no)
- ✅ Voting patterns and preferences
- ✅ Correlation between voters and choices
- ✅ Intermediate vote tallies during voting

### What's Visible
- ✅ Who participated in voting
- ✅ When votes were cast
- ✅ Final aggregated results
- ✅ Proposal details and timing

## 🎯 Key Learning Outcomes

### FHEVM Concepts Mastered
1. **Encrypted Boolean Operations** - Working with ebool type
2. **Conditional Logic on Encrypted Data** - FHE.select() operations
3. **Access Control Patterns** - Voter authorization systems
4. **Time-Based Contracts** - Voting period management
5. **Event-Driven Architecture** - Privacy-preserving notifications

### Real-World Applications
- **DAO Governance** - Decentralized decision making
- **Corporate Voting** - Board and shareholder votes
- **Community Polls** - Public opinion gathering
- **Election Systems** - Democratic participation
- **Consensus Mechanisms** - Group decision processes

## 🚀 Next Steps

### Enhancements You Could Add
1. **Multi-Choice Voting** - More than yes/no options
2. **Weighted Voting** - Different voting powers
3. **Quadratic Voting** - Cost-based preference expression
4. **Delegation** - Proxy voting mechanisms
5. **Result Verification** - Zero-knowledge proofs

Congratulations! You've built a sophisticated private voting system that maintains ballot secrecy while ensuring transparent results. Ready for the final challenge? Let's build a secret auction system! 🏆`,
        interactive: false
      }
    ]
  },
  {
    id: 'secret-auction',
    title: 'Secret Auction House',
    description: 'Create a sealed-bid auction where bids remain private until the auction ends.',
    difficulty: 'advanced',
    estimatedTime: '60 minutes',
    steps: [
      {
        id: 'auction-intro',
        title: 'Introduction to Secret Auctions',
        description: 'Understanding sealed-bid auctions and advanced FHE concepts',
        content: `# Secret Auction House with FHEVM 🏺

Welcome to the **advanced** FHEVM tutorial! You're now ready to tackle the most sophisticated privacy-preserving application: a **secret auction system**.

## 🎯 What We're Building

A complete sealed-bid auction platform featuring:
- **Private Bidding**: Bids remain secret until auction ends
- **Automatic Winner Selection**: Encrypted bid comparison
- **Secure Payments**: Automatic fund handling and refunds
- **Reserve Price Protection**: Hidden minimum acceptable bids
- **Platform Fees**: Automated commission handling

## 🧮 Advanced FHE Operations

This tutorial introduces the most complex FHEVM concepts:

### Encrypted Comparisons
\`\`\`solidity
// Compare encrypted bids to find highest
ebool isHigher = FHE.gt(newBid, currentHighestBid);
highestBid = FHE.select(isHigher, newBid, currentHighestBid);
\`\`\`

### Conditional Updates
\`\`\`solidity
// Update winner only if bid is higher
auctions[auctionId].highestBidder = msg.sender; // Simplified for demo
\`\`\`

Ready to build the most advanced privacy-preserving auction system? Let's create something revolutionary! 🚀`,
        interactive: false
      },
      {
        id: 'auction-contract',
        title: 'Building the Secret Auction Contract',
        description: 'Create a sophisticated sealed-bid auction system',
        content: `# Creating the SecretAuction Smart Contract

Now we'll build the most complex FHEVM contract yet - a full-featured sealed-bid auction system with encrypted bid comparison and automatic payment processing.

## 🏗️ Contract Architecture

### Core Data Structures
Our auction system uses several interconnected structures:

#### AuctionItem Structure
\`\`\`solidity
struct AuctionItem {
    string title;
    string description;
    address seller;
    euint32 reservePrice;    // Hidden minimum bid
    euint32 highestBid;      // Encrypted current highest
    address highestBidder;   // Current leader
    uint256 startTime;
    uint256 endTime;
    bool exists;
    bool finalized;
    bool cancelled;
}
\`\`\`

#### BidderInfo Structure
\`\`\`solidity
struct BidderInfo {
    euint32 bidAmount;       // Encrypted bid
    bool hasBid;
    bool refunded;
}
\`\`\`

### Advanced FHE Operations

#### Encrypted Bid Comparison
The heart of our auction system:
\`\`\`solidity
// Compare new bid with current highest
ebool isHigher = FHE.gt(bidAmount, auctions[id].highestBid);

// Conditionally update highest bid
auctions[id].highestBid = FHE.select(
    isHigher, 
    bidAmount, 
    auctions[id].highestBid
);
\`\`\`

#### Reserve Price Checking
\`\`\`solidity
// Check if bid meets reserve (would require decryption in practice)
ebool meetsReserve = FHE.gte(bidAmount, reservePrice);
\`\`\`

Let's examine the complete auction contract:`,
        code: {
          solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Secret Auction House
/// @notice A sealed-bid auction system where bids remain private until auction ends
contract SecretAuction is SepoliaConfig {
    // Auction item structure
    struct AuctionItem {
        string title;
        string description;
        address seller;
        euint32 reservePrice; // Encrypted minimum acceptable bid
        euint32 highestBid;   // Encrypted highest bid
        address highestBidder;
        uint256 startTime;
        uint256 endTime;
        bool exists;
        bool finalized;
        bool cancelled;
    }
    
    // Bidder information
    struct BidderInfo {
        euint32 bidAmount;
        bool hasBid;
        bool refunded;
    }
    
    // State variables
    address public auctionHouse;
    uint32 public auctionCount;
    uint256 public platformFeePercent = 250; // 2.5% in basis points
    
    mapping(uint32 => AuctionItem) public auctions;
    mapping(uint32 => mapping(address => BidderInfo)) public bidders;
    mapping(uint32 => address[]) public auctionBidders;
    mapping(address => uint256) public balances; // For refunds and payments
    
    // Events
    event AuctionCreated(
        uint32 indexed auctionId, 
        string title, 
        address indexed seller, 
        uint256 startTime, 
        uint256 endTime
    );
    event BidPlaced(uint32 indexed auctionId, address indexed bidder);
    event AuctionFinalized(
        uint32 indexed auctionId, 
        address indexed winner, 
        uint256 winningAmount
    );
    event AuctionCancelled(uint32 indexed auctionId);
    event RefundProcessed(uint32 indexed auctionId, address indexed bidder, uint256 amount);
    
    modifier onlyAuctionHouse() {
        require(msg.sender == auctionHouse, "Only auction house can perform this action");
        _;
    }
    
    modifier auctionExists(uint32 auctionId) {
        require(auctions[auctionId].exists, "Auction does not exist");
        _;
    }
    
    modifier auctionActive(uint32 auctionId) {
        require(block.timestamp >= auctions[auctionId].startTime, "Auction not started");
        require(block.timestamp <= auctions[auctionId].endTime, "Auction has ended");
        require(!auctions[auctionId].cancelled, "Auction is cancelled");
        _;
    }
    
    modifier auctionEnded(uint32 auctionId) {
        require(block.timestamp > auctions[auctionId].endTime, "Auction still active");
        require(!auctions[auctionId].cancelled, "Auction is cancelled");
        _;
    }
    
    modifier notFinalized(uint32 auctionId) {
        require(!auctions[auctionId].finalized, "Auction already finalized");
        _;
    }
    
    constructor() {
        auctionHouse = msg.sender;
    }
    
    /// @notice Create a new auction
    function createAuction(
        string calldata title,
        string calldata description,
        externalEuint32 encryptedReservePrice,
        bytes calldata reserveProof,
        uint256 durationInSeconds
    ) external returns (uint32) {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(durationInSeconds > 0, "Duration must be positive");
        require(durationInSeconds <= 7 days, "Duration cannot exceed 7 days");
        
        uint32 auctionId = auctionCount++;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + durationInSeconds;
        
        // Convert external encrypted reserve price to internal format
        euint32 reservePrice = FHE.fromExternal(encryptedReservePrice, reserveProof);
        
        auctions[auctionId] = AuctionItem({
            title: title,
            description: description,
            seller: msg.sender,
            reservePrice: reservePrice,
            highestBid: FHE.asEuint32(0),
            highestBidder: address(0),
            startTime: startTime,
            endTime: endTime,
            exists: true,
            finalized: false,
            cancelled: false
        });
        
        // Set up permissions for encrypted values
        FHE.allowThis(auctions[auctionId].reservePrice);
        FHE.allowThis(auctions[auctionId].highestBid);
        FHE.allow(auctions[auctionId].reservePrice, msg.sender);
        FHE.allow(auctions[auctionId].highestBid, msg.sender);
        FHE.allow(auctions[auctionId].reservePrice, auctionHouse);
        FHE.allow(auctions[auctionId].highestBid, auctionHouse);
        
        emit AuctionCreated(auctionId, title, msg.sender, startTime, endTime);
        return auctionId;
    }
    
    /// @notice Place an encrypted bid on an auction
    function placeBid(
        uint32 auctionId,
        externalEuint32 encryptedBid,
        bytes calldata bidProof
    ) external payable 
        auctionExists(auctionId)
        auctionActive(auctionId)
    {
        require(msg.sender != auctions[auctionId].seller, "Seller cannot bid");
        require(msg.value > 0, "Must send ETH with bid");
        
        // Convert external encrypted bid to internal format
        euint32 bidAmount = FHE.fromExternal(encryptedBid, bidProof);
        
        // Store bidder information
        if (!bidders[auctionId][msg.sender].hasBid) {
            auctionBidders[auctionId].push(msg.sender);
        }
        
        bidders[auctionId][msg.sender] = BidderInfo({
            bidAmount: bidAmount,
            hasBid: true,
            refunded: false
        });
        
        // Update highest bid using encrypted comparison
        ebool isHigher = FHE.gt(bidAmount, auctions[auctionId].highestBid);
        
        // Conditionally update highest bid and bidder
        auctions[auctionId].highestBid = FHE.select(
            isHigher, 
            bidAmount, 
            auctions[auctionId].highestBid
        );
        
        // Update highest bidder conditionally
        // Note: In a production system, this could be done off-chain to maintain more privacy
        auctions[auctionId].highestBidder = msg.sender; // Simplified for demo
        
        // Set permissions for the new bid
        FHE.allowThis(bidders[auctionId][msg.sender].bidAmount);
        FHE.allow(bidders[auctionId][msg.sender].bidAmount, msg.sender);
        FHE.allow(bidders[auctionId][msg.sender].bidAmount, auctionHouse);
        FHE.allowThis(auctions[auctionId].highestBid);
        
        // Store the ETH sent with the bid
        balances[msg.sender] += msg.value;
        
        emit BidPlaced(auctionId, msg.sender);
    }
    
    /// @notice Finalize the auction and determine the winner
    function finalizeAuction(uint32 auctionId) 
        external 
        auctionExists(auctionId)
        auctionEnded(auctionId)
        notFinalized(auctionId)
    {
        require(
            msg.sender == auctions[auctionId].seller || msg.sender == auctionHouse,
            "Only seller or auction house can finalize"
        );
        
        auctions[auctionId].finalized = true;
        
        // Check if there's a winner and if reserve price is met
        address winner = auctions[auctionId].highestBidder;
        
        if (winner != address(0)) {
            // In a real implementation, you would decrypt the winning bid here
            // For demonstration, we'll use a placeholder amount
            uint256 winningAmount = 1 ether; // This would be the decrypted winning bid
            
            // Check if reserve price is met (would require decryption)
            bool reserveMet = true; // Simplified for demo
            
            if (reserveMet) {
                // Process payment to seller (minus platform fee)
                uint256 platformFee = (winningAmount * platformFeePercent) / 10000;
                uint256 sellerPayment = winningAmount - platformFee;
                
                balances[auctions[auctionId].seller] += sellerPayment;
                balances[auctionHouse] += platformFee;
                
                // Deduct winning bid from winner's balance
                balances[winner] -= winningAmount;
                
                emit AuctionFinalized(auctionId, winner, winningAmount);
            } else {
                // Reserve not met, refund all bidders
                _refundAllBidders(auctionId);
                emit AuctionFinalized(auctionId, address(0), 0);
            }
        } else {
            // No bids, nothing to do
            emit AuctionFinalized(auctionId, address(0), 0);
        }
        
        // Process refunds for losing bidders
        _processRefunds(auctionId, winner);
    }
    
    /// @notice Get auction details
    function getAuction(uint32 auctionId) 
        external 
        view 
        auctionExists(auctionId)
        returns (
            string memory title,
            string memory description,
            address seller,
            uint256 startTime,
            uint256 endTime,
            bool finalized,
            bool cancelled
        ) 
    {
        AuctionItem storage auction = auctions[auctionId];
        return (
            auction.title,
            auction.description,
            auction.seller,
            auction.startTime,
            auction.endTime,
            auction.finalized,
            auction.cancelled
        );
    }
    
    /// @notice Internal function to process refunds for losing bidders
    function _processRefunds(uint32 auctionId, address winner) internal {
        address[] storage bidderList = auctionBidders[auctionId];
        
        for (uint256 i = 0; i < bidderList.length; i++) {
            address bidder = bidderList[i];
            if (bidder != winner && !bidders[auctionId][bidder].refunded) {
                bidders[auctionId][bidder].refunded = true;
                emit RefundProcessed(auctionId, bidder, balances[bidder]);
            }
        }
    }
    
    /// @notice Internal function to refund all bidders
    function _refundAllBidders(uint32 auctionId) internal {
        address[] storage bidderList = auctionBidders[auctionId];
        
        for (uint256 i = 0; i < bidderList.length; i++) {
            address bidder = bidderList[i];
            if (!bidders[auctionId][bidder].refunded) {
                bidders[auctionId][bidder].refunded = true;
                emit RefundProcessed(auctionId, bidder, balances[bidder]);
            }
        }
    }
}`
        },
        interactive: true
      },
      {
        id: 'auction-frontend',
        title: 'Building the Auction Interface',
        description: 'Create a comprehensive auction platform frontend',
        content: `# Building the Secret Auction Interface

Now let's create a sophisticated auction platform interface that handles encrypted bidding, real-time auction monitoring, and secure payment processing.

## 🎨 Interface Architecture

### Core Components
1. **Auction Discovery**: Browse available auctions
2. **Bidding Interface**: Submit encrypted bids
3. **Auction Monitoring**: Real-time status updates
4. **Payment Management**: Handle funds and refunds
5. **Seller Dashboard**: Create and manage auctions

### Advanced Features
- **Real-time Countdowns**: Live auction timers
- **Bid History**: Anonymous participation tracking
- **Payment Status**: Balance and transaction monitoring
- **Reserve Price Handling**: Hidden minimum bid management

## 💰 Payment Flow Management

### Bidding Process
1. **ETH Deposit**: Send funds with bid submission
2. **Encrypted Bid**: Submit private bid amount
3. **Balance Tracking**: Monitor escrow balances
4. **Automatic Refunds**: Process losing bid returns

### Settlement Process
1. **Winner Determination**: Decrypt highest bid
2. **Payment Distribution**: Seller payment minus fees
3. **Refund Processing**: Return losing bidder funds
4. **Fee Collection**: Platform commission handling

Let's build the complete auction interface:`,
        code: {
          jsx: `"use client";

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { createFhevmInstance } from '@zama-fhe/relayer-sdk';

const AUCTION_ABI = [
  "function createAuction(string title, string description, uint256 encryptedReserve, bytes proof, uint256 duration) returns (uint32)",
  "function placeBid(uint32 auctionId, uint256 encryptedBid, bytes proof) payable",
  "function finalizeAuction(uint32 auctionId)",
  "function cancelAuction(uint32 auctionId)",
  "function withdraw()",
  "function getAuction(uint32 id) view returns (string, string, address, uint256, uint256, bool, bool)",
  "function getHighestBid(uint32 id) view returns (uint256, address)",
  "function getBidInfo(uint32 id, address bidder) view returns (uint256, bool)",
  "function isAuctionActive(uint32 id) view returns (bool)",
  "function auctionCount() view returns (uint32)",
  "function balances(address) view returns (uint256)",
  "event AuctionCreated(uint32 indexed auctionId, string title, address indexed seller, uint256 startTime, uint256 endTime)",
  "event BidPlaced(uint32 indexed auctionId, address indexed bidder)",
  "event AuctionFinalized(uint32 indexed auctionId, address indexed winner, uint256 winningAmount)"
];

export function SecretAuctionDemo() {
  // Connection state
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [fhevmInstance, setFhevmInstance] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [userBalance, setUserBalance] = useState('0');
  
  // Auction state
  const [auctions, setAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isBidding, setIsBidding] = useState(false);
  const [message, setMessage] = useState('Welcome to Secret Auction House!');
  
  // Create auction state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAuction, setNewAuction] = useState({
    title: '',
    description: '',
    reservePrice: '',
    duration: 24 // hours
  });
  const [isCreating, setIsCreating] = useState(false);

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setMessage('Please install MetaMask!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setUserAddress(address);
      setIsConnected(true);
      setMessage('Wallet connected successfully!');

      // Initialize FHEVM instance
      const instance = await createFhevmInstance({
        chainId: 31337,
        publicKeyProvider: provider
      });
      setFhevmInstance(instance);

      // Initialize contract
      const contractAddress = "0x..."; // Your deployed contract address
      const contract = new ethers.Contract(contractAddress, AUCTION_ABI, signer);
      setContract(contract);

      // Load initial data
      await loadAuctions(contract);
      await loadUserBalance(contract, address);

    } catch (error) {
      setMessage('Failed to connect: ' + error.message);
    }
  };

  // Place encrypted bid
  const placeBid = async () => {
    if (!fhevmInstance || !contract || !selectedAuction || !bidAmount) return;

    setIsBidding(true);
    setMessage('Encrypting your bid...');

    try {
      // Create encrypted input for bid amount
      const input = fhevmInstance.createEncryptedInput(
        await contract.getAddress(),
        userAddress
      );
      
      // Add bid amount (convert ETH to wei)
      const bidWei = ethers.parseEther(bidAmount);
      input.add32(Number(bidWei / BigInt(10**14))); // Simplified for demo
      
      // Encrypt the bid
      const encryptedInput = await input.encrypt();
      
      setMessage('Submitting encrypted bid...');
      
      // Submit bid with ETH
      const tx = await contract.placeBid(
        selectedAuction.id,
        encryptedInput.handles[0],
        encryptedInput.inputProof,
        { value: bidWei }
      );
      
      setMessage('Waiting for confirmation...');
      await tx.wait();
      
      setMessage(\`Bid of \${bidAmount} ETH submitted successfully!\`);
      
      // Reset bidding state
      setSelectedAuction(null);
      setBidAmount('');
      
      // Refresh data
      await loadAuctions(contract);
      await loadUserBalance(contract, userAddress);
      
    } catch (error) {
      setMessage('Bidding failed: ' + error.message);
    } finally {
      setIsBidding(false);
    }
  };

  // Format time remaining
  const formatTimeRemaining = (endTime) => {
    const now = Date.now();
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Ended';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return \`\${hours}h \${minutes}m remaining\`;
  };

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Secret Auction House 🏺
        </h2>
        <p className="text-gray-600 mb-6">
          Connect your wallet to participate in private sealed-bid auctions
        </p>
        <button 
          onClick={connectWallet}
          className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Connect MetaMask
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Secret Auction House 🏺
          </h1>
          <p className="opacity-90">
            Private sealed-bid auctions with complete bid confidentiality
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <span>Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}</span>
              <span>Balance: {userBalance} ETH</span>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
            >
              Create Auction
            </button>
          </div>
        </div>

        {/* Create Auction Form */}
        {showCreateForm && (
          <div className="p-6 bg-yellow-50 border-b">
            <h3 className="text-lg font-semibold mb-4">Create New Auction</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Auction title"
                value={newAuction.title}
                onChange={(e) => setNewAuction({...newAuction, title: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                placeholder="Reserve price (ETH)"
                value={newAuction.reservePrice}
                onChange={(e) => setNewAuction({...newAuction, reservePrice: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                step="0.01"
              />
              <textarea
                placeholder="Description"
                value={newAuction.description}
                onChange={(e) => setNewAuction({...newAuction, description: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
              />
              <select
                value={newAuction.duration}
                onChange={(e) => setNewAuction({...newAuction, duration: Number(e.target.value)})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={1}>1 hour</option>
                <option value={6}>6 hours</option>
                <option value={24}>24 hours</option>
                <option value={72}>3 days</option>
              </select>
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!newAuction.title.trim() || isCreating}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {isCreating ? 'Creating...' : 'Create Auction'}
              </button>
            </div>
          </div>
        )}

        {/* Bidding Interface */}
        {selectedAuction && (
          <div className="p-6 bg-blue-50 border-b">
            <h3 className="text-lg font-semibold mb-4">
              Bidding on: {selectedAuction.title}
            </h3>
            <p className="text-gray-700 mb-4">{selectedAuction.description}</p>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                placeholder="Bid amount (ETH)"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01"
                min="0"
              />
              <button
                onClick={() => {
                  setSelectedAuction(null);
                  setBidAmount('');
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={placeBid}
                disabled={!bidAmount || isBidding}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isBidding ? 'Bidding...' : 'Submit Secret Bid'}
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Your bid will be encrypted and remain private until the auction ends
            </p>
          </div>
        )}

        {/* Auctions List */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-6">Available Auctions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <div
                key={auction.id}
                className={\`border rounded-lg p-4 \${
                  auction.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                }\`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-900">{auction.title}</h4>
                  <span className={\`text-xs px-2 py-1 rounded-full \${
                    auction.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }\`}>
                    {auction.isActive ? 'Active' : 'Ended'}
                  </span>
                </div>
                
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                  {auction.description}
                </p>
                
                <div className="text-xs text-gray-600 space-y-1 mb-3">
                  <div>Seller: {auction.seller.slice(0, 6)}...{auction.seller.slice(-4)}</div>
                  <div>Time: {formatTimeRemaining(auction.endTime)}</div>
                  {auction.highestBidder !== ethers.ZeroAddress && (
                    <div>Leading: {auction.highestBidder.slice(0, 6)}...{auction.highestBidder.slice(-4)}</div>
                  )}
                </div>
                
                {auction.isActive && auction.seller !== userAddress && (
                  <button
                    onClick={() => setSelectedAuction(auction)}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    Place Bid
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {auctions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No auctions available yet. Create the first one!
            </div>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="p-4 bg-purple-50 border-t">
          <h4 className="font-semibold text-purple-800 mb-2">🔒 Privacy Features</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• All bids are encrypted before submission to the blockchain</li>
            <li>• Individual bid amounts remain private throughout the auction</li>
            <li>• Only the winning bid amount is revealed when auction ends</li>
            <li>• Reserve prices are hidden from all bidders</li>
            <li>• Losing bids are never disclosed, ensuring complete privacy</li>
          </ul>
        </div>
      </div>
    </div>
  );
}`
        },
        interactive: true
      },
      {
        id: 'auction-deployment',
        title: 'Deploying and Testing the Auction System',
        description: 'Deploy and test the complete sealed-bid auction platform',
        content: `# Deploying and Testing the Secret Auction System

Congratulations! You've built the most sophisticated FHEVM application possible. Let's deploy and test this advanced sealed-bid auction system.

## 🚀 Deployment Process

### Contract Compilation
\`\`\`bash
npx hardhat compile
\`\`\`

Expected output:
- ✅ SecretAuction contract compiled successfully
- ✅ Advanced FHE operations verified
- ✅ Complex state management validated
- ✅ Payment system integration confirmed

### Local Network Deployment
\`\`\`bash
npx hardhat deploy --network localhost --tags SecretAuction
\`\`\`

### Testnet Deployment
\`\`\`bash
npx hardhat deploy --network sepolia --tags SecretAuction
\`\`\`

## 🧪 Comprehensive Testing Scenarios

### Scenario 1: Basic Auction Flow
1. **Create Auction** with encrypted reserve price
2. **Multiple Bidders** submit encrypted bids
3. **Bid Comparison** happens automatically on encrypted data
4. **Auction Finalization** reveals winner and amount
5. **Payment Processing** distributes funds correctly

### Scenario 2: Privacy Verification
1. **Monitor Blockchain** during active bidding
2. **Verify Bid Encryption** - amounts not visible
3. **Check Event Logs** - only addresses visible
4. **Confirm Privacy** until auction ends
5. **Result Revelation** only shows winner amount

### Scenario 3: Complex Economic Testing
1. **Reserve Price Testing** - bids below reserve rejected
2. **Platform Fee Calculation** - correct fee distribution
3. **Refund Processing** - losing bidders get funds back
4. **Edge Cases** - no bids, tied bids, cancelled auctions
5. **Gas Optimization** - efficient batch operations

### Scenario 4: Advanced Features
1. **Multiple Concurrent Auctions** - system scalability
2. **High-Value Auctions** - large ETH amount handling
3. **Time-Critical Auctions** - last-minute bidding
4. **Seller Tools** - auction management capabilities
5. **Admin Functions** - platform fee adjustments

## 📊 Expected Results

### During Auction Period
- ✅ **Bid Amounts**: Completely encrypted on-chain
- ✅ **Reserve Prices**: Hidden from all participants
- ✅ **Current Leader**: Only address visible, not amount
- ✅ **Participation**: Anonymous bid activity indicators
- ✅ **Real-time Updates**: Live auction status and countdowns

### After Auction Completion
- ✅ **Winner Revealed**: Public announcement of winning bidder
- ✅ **Winning Amount**: Final sale price disclosed
- ✅ **Payment Processing**: Automatic fund distribution
- ✅ **Refund Completion**: Losing bidders receive funds back
- ✅ **Privacy Maintained**: Individual losing bids remain secret

## 🔍 Advanced Privacy Analysis

### Cryptographic Guarantees
1. **Bid Confidentiality**: Individual amounts never revealed
2. **Reserve Privacy**: Minimum prices stay hidden
3. **Comparison Security**: Winner determination without disclosure
4. **Historical Privacy**: Past bid amounts remain encrypted forever

### Economic Security
1. **Truthful Bidding**: Sealed-bid mechanism encourages honest valuations
2. **Fair Price Discovery**: Market-driven outcomes without manipulation
3. **Seller Protection**: Reserve prices prevent below-value sales
4. **Platform Sustainability**: Fee structure supports ongoing operations

## 🎯 Mastery Achievements

### Technical Mastery
- ✅ **Complex FHE Operations**: Encrypted comparisons and conditional logic
- ✅ **Advanced Solidity Patterns**: Multi-contract interactions and state machines
- ✅ **Payment System Design**: Secure escrow and automatic distribution
- ✅ **Gas Optimization**: Efficient batch processing and storage patterns
- ✅ **Event Architecture**: Privacy-preserving notification systems

### Cryptographic Understanding
- ✅ **Sealed-Bid Mechanisms**: Auction theory and privacy guarantees
- ✅ **Encrypted Comparisons**: Secure maximum-finding algorithms
- ✅ **Access Control**: Dynamic permission management systems
- ✅ **Result Revelation**: Selective information disclosure patterns
- ✅ **Privacy Engineering**: End-to-end confidentiality design

### System Architecture
- ✅ **Scalable Design**: Multi-auction platform architecture
- ✅ **User Experience**: Complex interaction flow management
- ✅ **Economic Incentives**: Fee structures and market dynamics
- ✅ **Security Patterns**: Attack prevention and mitigation strategies
- ✅ **Real-World Integration**: Production-ready system design

## 🌟 Real-World Impact

### Applications You Can Build
1. **NFT Marketplaces** - Private art and collectible auctions
2. **Domain Auctions** - Premium web domain sales
3. **Government Procurement** - Public contract bidding
4. **Spectrum Auctions** - Telecommunications licensing
5. **Carbon Credit Trading** - Environmental asset markets
6. **Real Estate Auctions** - Property sales with privacy
7. **Intellectual Property** - Patent and license auctions
8. **DeFi Liquidations** - Private collateral disposal

### Economic Innovation
- **Truthful Bidding**: Eliminates strategic bidding behavior
- **Fair Price Discovery**: True market value determination
- **Reduced Manipulation**: Prevents bid coordination and collusion
- **Increased Participation**: Privacy encourages more bidders
- **Market Efficiency**: Optimal allocation of resources

## 🏆 Congratulations!

You've successfully completed the most advanced FHEVM tutorial series! You now possess:

### Core FHEVM Skills
- **Encrypted Arithmetic**: Add, subtract, multiply on private data
- **Boolean Operations**: Logical operations on encrypted values
- **Comparison Operations**: Greater than, less than on encrypted numbers
- **Conditional Logic**: Select operations based on encrypted conditions
- **Access Control**: Permission management for encrypted data

### Advanced Development Patterns
- **State Machine Design**: Complex contract lifecycle management
- **Event-Driven Architecture**: Privacy-preserving notifications
- **Payment System Integration**: Secure fund handling and distribution
- **Gas Optimization**: Efficient operations and storage patterns
- **Security Best Practices**: Attack prevention and mitigation

### Privacy Engineering
- **End-to-End Encryption**: Data privacy throughout entire workflows
- **Selective Disclosure**: Revealing only necessary information
- **Zero-Knowledge Patterns**: Proving without revealing
- **Cryptographic Protocols**: Advanced privacy-preserving mechanisms

## 🚀 Your FHEVM Journey Continues

You're now equipped to:
- **Build Production dApps** with advanced privacy features
- **Contribute to FHEVM Ecosystem** with innovative applications
- **Research New Patterns** in privacy-preserving computation
- **Educate Others** about FHE and blockchain privacy
- **Pioneer New Use Cases** that weren't possible before FHEVM

### Next Steps
1. **Deploy to Mainnet** - Launch your auction platform
2. **Open Source** - Share your code with the community
3. **Build a Business** - Create sustainable privacy-focused products
4. **Join the Community** - Contribute to FHEVM development
5. **Teach Others** - Help grow the privacy-preserving ecosystem

## 🎉 Welcome to the Future of Privacy

You've mastered the most advanced privacy-preserving technology available on blockchain. Use this knowledge to build a more private, fair, and secure digital economy.

The future of blockchain is private, and you're now equipped to build it! 🌟

**Keep building, keep learning, and keep pushing the boundaries of what's possible with FHEVM!** 🚀`,
        interactive: false
      }
    ]
  }
];

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [currentExample, setCurrentExample] = useState<TutorialExample | null>(TUTORIAL_EXAMPLES[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [examples] = useState<TutorialExample[]>(TUTORIAL_EXAMPLES);
  const searchParams = useSearchParams();

  // Handle URL parameters to select tutorial
  useEffect(() => {
    const exampleParam = searchParams.get('example');
    if (exampleParam) {
      const targetExample = examples.find(ex => ex.id === exampleParam);
      if (targetExample) {
        setCurrentExample(targetExample);
        setCurrentStepIndex(0); // Reset to first step
      }
    }
  }, [searchParams, examples]);

  const nextStep = () => {
    if (currentExample && currentStepIndex < currentExample.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const goToStep = (index: number) => {
    if (currentExample && index >= 0 && index < currentExample.steps.length) {
      setCurrentStepIndex(index);
    }
  };

  const markStepCompleted = (stepId: string) => {
    if (currentExample) {
      const updatedSteps = currentExample.steps.map(step =>
        step.id === stepId ? { ...step, completed: true } : step
      );
      setCurrentExample({ ...currentExample, steps: updatedSteps });
    }
  };

  const resetProgress = () => {
    setCurrentStepIndex(0);
    if (currentExample) {
      const resetSteps = currentExample.steps.map(step => ({ ...step, completed: false }));
      setCurrentExample({ ...currentExample, steps: resetSteps });
    }
  };

  const value: TutorialContextType = {
    currentExample,
    currentStepIndex,
    examples,
    setCurrentExample: (example) => {
      setCurrentExample(example);
      setCurrentStepIndex(0);
    },
    nextStep,
    prevStep,
    goToStep,
    markStepCompleted,
    resetProgress
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
}
