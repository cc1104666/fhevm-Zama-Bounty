"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

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

const COMPLETE_TUTORIAL_EXAMPLES: TutorialExample[] = [
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
      }
      // ... rest of hello-fhevm steps from original file
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

### Frontend Components
1. **Proposal Browser**: View active and past proposals
2. **Voting Interface**: Cast encrypted votes with user-friendly UI
3. **Results Dashboard**: Display voting outcomes and statistics
4. **Admin Panel**: Manage proposals and voter authorization

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
if (FHE.decrypt(isHigher)) {
    highestBidder = msg.sender;
}
\`\`\`

Ready to build the most advanced privacy-preserving auction system? Let's create something revolutionary! 🚀`,
        interactive: false
      }
    ]
  }
];

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [currentExample, setCurrentExample] = useState<TutorialExample | null>(COMPLETE_TUTORIAL_EXAMPLES[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [examples] = useState<TutorialExample[]>(COMPLETE_TUTORIAL_EXAMPLES);

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
