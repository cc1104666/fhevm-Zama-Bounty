// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32, ebool, externalEbool} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Private Voting System
/// @author Zama Community Tutorial
/// @notice A confidential voting system where individual votes remain private until tallied
/// @dev Demonstrates encrypted voting, access control, and time-based operations in FHEVM
contract PrivateVoting is SepoliaConfig {
    // Voting proposal structure
    struct Proposal {
        string description;
        euint32 yesVotes;
        euint32 noVotes;
        uint256 startTime;
        uint256 endTime;
        bool exists;
        bool resultsRevealed;
    }
    
    // Encrypted vote structure
    struct EncryptedVote {
        euint32 proposalId;
        ebool vote; // true for yes, false for no
        bool hasVoted;
    }
    
    // State variables
    address public admin;
    uint32 public proposalCount;
    mapping(uint32 => Proposal) public proposals;
    mapping(address => mapping(uint32 => bool)) public hasVoted;
    mapping(address => bool) public authorizedVoters;
    
    // Events
    event ProposalCreated(uint32 indexed proposalId, string description, uint256 startTime, uint256 endTime);
    event VoteCast(address indexed voter, uint32 indexed proposalId);
    event ResultsRevealed(uint32 indexed proposalId, uint32 yesVotes, uint32 noVotes);
    event VoterAuthorized(address indexed voter);
    event VoterRevoked(address indexed voter);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier onlyAuthorizedVoter() {
        require(authorizedVoters[msg.sender], "Not authorized to vote");
        _;
    }
    
    modifier proposalExists(uint32 proposalId) {
        require(proposals[proposalId].exists, "Proposal does not exist");
        _;
    }
    
    modifier votingOpen(uint32 proposalId) {
        require(block.timestamp >= proposals[proposalId].startTime, "Voting has not started");
        require(block.timestamp <= proposals[proposalId].endTime, "Voting has ended");
        _;
    }
    
    modifier votingClosed(uint32 proposalId) {
        require(block.timestamp > proposals[proposalId].endTime, "Voting is still open");
        _;
    }
    
    modifier hasNotVoted(uint32 proposalId) {
        require(!hasVoted[msg.sender][proposalId], "Already voted on this proposal");
        _;
    }
    
    /// @notice Initialize the voting contract
    constructor() {
        admin = msg.sender;
        // Admin is automatically authorized to vote
        authorizedVoters[admin] = true;
    }
    
    /// @notice Create a new voting proposal
    /// @param description The description of the proposal
    /// @param durationInSeconds How long the voting should remain open
    function createProposal(
        string calldata description,
        uint256 durationInSeconds
    ) external onlyAdmin returns (uint32) {
        require(durationInSeconds > 0, "Duration must be positive");
        require(bytes(description).length > 0, "Description cannot be empty");
        
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
        
        // Grant permissions for encrypted vote counting
        FHE.allowThis(proposals[proposalId].yesVotes);
        FHE.allowThis(proposals[proposalId].noVotes);
        FHE.allow(proposals[proposalId].yesVotes, admin);
        FHE.allow(proposals[proposalId].noVotes, admin);
        
        emit ProposalCreated(proposalId, description, startTime, endTime);
        return proposalId;
    }
    
    /// @notice Cast an encrypted vote on a proposal
    /// @param proposalId The ID of the proposal to vote on
    /// @param encryptedVote The encrypted vote (true for yes, false for no)
    /// @param voteProof Cryptographic proof for the encrypted vote
    function castVote(
        uint32 proposalId,
        externalEbool encryptedVote,
        bytes calldata voteProof
    ) external 
        onlyAuthorizedVoter
        proposalExists(proposalId)
        votingOpen(proposalId)
        hasNotVoted(proposalId)
    {
        // Convert external encrypted vote to internal format
        ebool vote = FHE.fromExternal(encryptedVote, voteProof);
        
        // Create encrypted one for vote counting
        euint32 one = FHE.asEuint32(1);
        
        // Add encrypted vote to appropriate counter
        // If vote is true (yes), add to yesVotes, otherwise add to noVotes
        proposals[proposalId].yesVotes = FHE.add(
            proposals[proposalId].yesVotes,
            FHE.select(vote, one, FHE.asEuint32(0))
        );
        
        proposals[proposalId].noVotes = FHE.add(
            proposals[proposalId].noVotes,
            FHE.select(vote, FHE.asEuint32(0), one)
        );
        
        // Update permissions
        FHE.allowThis(proposals[proposalId].yesVotes);
        FHE.allowThis(proposals[proposalId].noVotes);
        FHE.allow(proposals[proposalId].yesVotes, admin);
        FHE.allow(proposals[proposalId].noVotes, admin);
        
        // Mark voter as having voted
        hasVoted[msg.sender][proposalId] = true;
        
        emit VoteCast(msg.sender, proposalId);
    }
    
    /// @notice Get encrypted vote counts (only admin can decrypt)
    /// @param proposalId The ID of the proposal
    /// @return yesVotes Encrypted count of yes votes
    /// @return noVotes Encrypted count of no votes
    function getVoteCounts(uint32 proposalId) 
        external 
        view 
        proposalExists(proposalId)
        returns (euint32 yesVotes, euint32 noVotes) 
    {
        return (proposals[proposalId].yesVotes, proposals[proposalId].noVotes);
    }
    
    /// @notice Reveal voting results (only admin, only after voting ends)
    /// @param proposalId The ID of the proposal
    /// @dev This function would typically decrypt the results using FHEVM client
    function markResultsRevealed(uint32 proposalId) 
        external 
        onlyAdmin
        proposalExists(proposalId)
        votingClosed(proposalId)
    {
        proposals[proposalId].resultsRevealed = true;
        
        // In a real implementation, you would decrypt the votes here
        // For demonstration, we emit an event with placeholder values
        emit ResultsRevealed(proposalId, 0, 0); // Actual values would be decrypted
    }
    
    /// @notice Authorize a voter
    /// @param voter The address to authorize
    function authorizeVoter(address voter) external onlyAdmin {
        require(voter != address(0), "Invalid voter address");
        authorizedVoters[voter] = true;
        emit VoterAuthorized(voter);
    }
    
    /// @notice Revoke voter authorization
    /// @param voter The address to revoke
    function revokeVoter(address voter) external onlyAdmin {
        require(voter != admin, "Cannot revoke admin");
        authorizedVoters[voter] = false;
        emit VoterRevoked(voter);
    }
    
    /// @notice Batch authorize multiple voters
    /// @param voters Array of addresses to authorize
    function batchAuthorizeVoters(address[] calldata voters) external onlyAdmin {
        for (uint256 i = 0; i < voters.length; i++) {
            require(voters[i] != address(0), "Invalid voter address");
            authorizedVoters[voters[i]] = true;
            emit VoterAuthorized(voters[i]);
        }
    }
    
    /// @notice Check if voting is currently open for a proposal
    /// @param proposalId The ID of the proposal
    /// @return isOpen True if voting is currently open
    function isVotingOpen(uint32 proposalId) 
        external 
        view 
        proposalExists(proposalId)
        returns (bool isOpen) 
    {
        return block.timestamp >= proposals[proposalId].startTime && 
               block.timestamp <= proposals[proposalId].endTime;
    }
    
    /// @notice Get proposal details
    /// @param proposalId The ID of the proposal
    /// @return description The proposal description
    /// @return startTime When voting starts
    /// @return endTime When voting ends
    /// @return resultsRevealed Whether results have been revealed
    function getProposal(uint32 proposalId) 
        external 
        view 
        proposalExists(proposalId)
        returns (
            string memory description,
            uint256 startTime,
            uint256 endTime,
            bool resultsRevealed
        ) 
    {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.description,
            proposal.startTime,
            proposal.endTime,
            proposal.resultsRevealed
        );
    }
    
    /// @notice Get total number of proposals
    /// @return count The total number of proposals created
    function getProposalCount() external view returns (uint32 count) {
        return proposalCount;
    }
    
    /// @notice Check if an address is authorized to vote
    /// @param voter The address to check
    /// @return authorized True if the address is authorized
    function isAuthorizedVoter(address voter) external view returns (bool authorized) {
        return authorizedVoters[voter];
    }
    
    /// @notice Emergency function to extend voting period
    /// @param proposalId The ID of the proposal
    /// @param additionalSeconds Additional seconds to extend voting
    function extendVoting(uint32 proposalId, uint256 additionalSeconds) 
        external 
        onlyAdmin
        proposalExists(proposalId)
    {
        require(block.timestamp <= proposals[proposalId].endTime, "Voting already ended");
        require(additionalSeconds > 0, "Extension must be positive");
        
        proposals[proposalId].endTime += additionalSeconds;
    }
}
