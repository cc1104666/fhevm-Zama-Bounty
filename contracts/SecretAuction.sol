// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Secret Auction House
/// @author Zama Community Tutorial  
/// @notice A sealed-bid auction system where bids remain private until the auction ends
/// @dev Demonstrates advanced FHEVM operations: encrypted comparisons, conditional logic, and complex state management
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
    event PaymentProcessed(uint32 indexed auctionId, address indexed seller, uint256 amount);
    
    modifier onlyAuctionHouse() {
        require(msg.sender == auctionHouse, "Only auction house can perform this action");
        _;
    }
    
    modifier auctionExists(uint32 auctionId) {
        require(auctions[auctionId].exists, "Auction does not exist");
        _;
    }
    
    modifier auctionActive(uint32 auctionId) {
        require(block.timestamp >= auctions[auctionId].startTime, "Auction has not started");
        require(block.timestamp <= auctions[auctionId].endTime, "Auction has ended");
        require(!auctions[auctionId].cancelled, "Auction is cancelled");
        _;
    }
    
    modifier auctionEnded(uint32 auctionId) {
        require(block.timestamp > auctions[auctionId].endTime, "Auction is still active");
        require(!auctions[auctionId].cancelled, "Auction is cancelled");
        _;
    }
    
    modifier notFinalized(uint32 auctionId) {
        require(!auctions[auctionId].finalized, "Auction already finalized");
        _;
    }
    
    /// @notice Initialize the auction house
    constructor() {
        auctionHouse = msg.sender;
    }
    
    /// @notice Create a new auction
    /// @param title The title of the auction item
    /// @param description Description of the item
    /// @param encryptedReservePrice Encrypted minimum acceptable bid
    /// @param reserveProof Cryptographic proof for the reserve price
    /// @param durationInSeconds How long the auction should run
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
    /// @param auctionId The ID of the auction
    /// @param encryptedBid The encrypted bid amount
    /// @param bidProof Cryptographic proof for the bid
    function placeBid(
        uint32 auctionId,
        externalEuint32 encryptedBid,
        bytes calldata bidProof
    ) external payable 
        auctionExists(auctionId)
        auctionActive(auctionId)
    {
        require(msg.sender != auctions[auctionId].seller, "Seller cannot bid on own auction");
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
    /// @param auctionId The ID of the auction to finalize
    /// @dev This function requires decryption of the winning bid amount
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
            uint256 winningAmount = 0; // This would be the decrypted winning bid
            
            // Check if reserve price is met (would require decryption)
            // bool reserveMet = decryptedHighestBid >= decryptedReservePrice;
            
            // For demo purposes, assume reserve is met
            bool reserveMet = true;
            
            if (reserveMet) {
                // Process payment to seller (minus platform fee)
                uint256 platformFee = (winningAmount * platformFeePercent) / 10000;
                uint256 sellerPayment = winningAmount - platformFee;
                
                balances[auctions[auctionId].seller] += sellerPayment;
                balances[auctionHouse] += platformFee;
                
                // Deduct winning bid from winner's balance
                balances[winner] -= winningAmount;
                
                emit PaymentProcessed(auctionId, auctions[auctionId].seller, sellerPayment);
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
    
    /// @notice Cancel an auction (only before it ends)
    /// @param auctionId The ID of the auction to cancel
    function cancelAuction(uint32 auctionId) 
        external 
        auctionExists(auctionId)
        notFinalized(auctionId)
    {
        require(
            msg.sender == auctions[auctionId].seller || msg.sender == auctionHouse,
            "Only seller or auction house can cancel"
        );
        require(block.timestamp <= auctions[auctionId].endTime, "Cannot cancel after auction ends");
        
        auctions[auctionId].cancelled = true;
        auctions[auctionId].finalized = true;
        
        // Refund all bidders
        _refundAllBidders(auctionId);
        
        emit AuctionCancelled(auctionId);
    }
    
    /// @notice Withdraw available balance
    function withdraw() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance to withdraw");
        
        balances[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
    }
    
    /// @notice Get auction details
    /// @param auctionId The ID of the auction
    /// @return title The auction title
    /// @return description The auction description
    /// @return seller The seller's address
    /// @return startTime When the auction starts
    /// @return endTime When the auction ends
    /// @return finalized Whether the auction is finalized
    /// @return cancelled Whether the auction is cancelled
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
    
    /// @notice Get encrypted bid information (only bidder can decrypt their own bid)
    /// @param auctionId The ID of the auction
    /// @param bidder The bidder's address
    /// @return bidAmount The encrypted bid amount
    /// @return hasBid Whether the address has placed a bid
    function getBidInfo(uint32 auctionId, address bidder) 
        external 
        view 
        returns (euint32 bidAmount, bool hasBid) 
    {
        BidderInfo storage info = bidders[auctionId][bidder];
        return (info.bidAmount, info.hasBid);
    }
    
    /// @notice Get current highest bid (encrypted)
    /// @param auctionId The ID of the auction
    /// @return highestBid The encrypted highest bid
    /// @return highestBidder The address of the current highest bidder
    function getHighestBid(uint32 auctionId) 
        external 
        view 
        auctionExists(auctionId)
        returns (euint32 highestBid, address highestBidder) 
    {
        return (auctions[auctionId].highestBid, auctions[auctionId].highestBidder);
    }
    
    /// @notice Check if auction is currently active
    /// @param auctionId The ID of the auction
    /// @return active True if auction is currently accepting bids
    function isAuctionActive(uint32 auctionId) 
        external 
        view 
        auctionExists(auctionId)
        returns (bool active) 
    {
        return block.timestamp >= auctions[auctionId].startTime && 
               block.timestamp <= auctions[auctionId].endTime &&
               !auctions[auctionId].cancelled;
    }
    
    /// @notice Get total number of auctions
    /// @return count The total number of auctions created
    function getAuctionCount() external view returns (uint32 count) {
        return auctionCount;
    }
    
    /// @notice Set platform fee percentage (only auction house)
    /// @param newFeePercent New fee percentage in basis points (e.g., 250 = 2.5%)
    function setPlatformFee(uint256 newFeePercent) external onlyAuctionHouse {
        require(newFeePercent <= 1000, "Fee cannot exceed 10%"); // Max 10%
        platformFeePercent = newFeePercent;
    }
    
    /// @notice Internal function to process refunds for losing bidders
    /// @param auctionId The ID of the auction
    /// @param winner The winning bidder (excluded from refunds)
    function _processRefunds(uint32 auctionId, address winner) internal {
        address[] storage bidderList = auctionBidders[auctionId];
        
        for (uint256 i = 0; i < bidderList.length; i++) {
            address bidder = bidderList[i];
            if (bidder != winner && !bidders[auctionId][bidder].refunded) {
                bidders[auctionId][bidder].refunded = true;
                // Balance already stored when bid was placed
                emit RefundProcessed(auctionId, bidder, balances[bidder]);
            }
        }
    }
    
    /// @notice Internal function to refund all bidders (used for cancelled auctions)
    /// @param auctionId The ID of the auction
    function _refundAllBidders(uint32 auctionId) internal {
        address[] storage bidderList = auctionBidders[auctionId];
        
        for (uint256 i = 0; i < bidderList.length; i++) {
            address bidder = bidderList[i];
            if (!bidders[auctionId][bidder].refunded) {
                bidders[auctionId][bidder].refunded = true;
                // Balance already stored when bid was placed
                emit RefundProcessed(auctionId, bidder, balances[bidder]);
            }
        }
    }
}
