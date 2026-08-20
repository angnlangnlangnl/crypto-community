// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DecentralizedChat is ReentrancyGuard, Ownable {
    struct User {
        address wallet;
        string username;
        string avatarHash;
        uint256 reputation;
        bool isRegistered;
        uint256 createdAt;
    }
    
    struct Channel {
        uint256 id;
        string name;
        string description;
        address creator;
        uint256 memberCount;
        bool isPrivate;
        bool isActive;
        uint256 createdAt;
    }
    
    struct Message {
        uint256 id;
        uint256 channelId;
        address sender;
        string contentHash;
        uint256 timestamp;
        uint256 likes;
        bool isPinned;
    }
    
    mapping(address => User) public users;
    mapping(uint256 => Channel) public channels;
    mapping(uint256 => Message) public messages;
    mapping(uint256 => mapping(address => bool)) public channelMembers;
    mapping(address => uint256[]) public userChannels;
    mapping(address => uint256) public lastMessageTime;
    
    IERC20 public rewardToken;
    uint256 public messageReward = 1 * 10**18;
    uint256 public channelCreationCost = 100 * 10**18;
    uint256 public messageCooldown = 30 seconds;
    uint256 public channelCount;
    uint256 public messageCount;
    
    event UserRegistered(address indexed user, string username);
    event ChannelCreated(uint256 indexed channelId, address indexed creator, string name);
    event ChannelJoined(uint256 indexed channelId, address indexed user);
    event MessageSent(uint256 indexed messageId, uint256 indexed channelId, address indexed sender);
    event MessageLiked(uint256 indexed messageId, address indexed liker);
    event RewardDistributed(address indexed user, uint256 amount);
    
    constructor(address _rewardToken) Ownable(msg.sender) {
        rewardToken = IERC20(_rewardToken);
    }
    
    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }
    
    function registerUser(string memory _username, string memory _avatarHash) external {
        require(bytes(_username).length >= 3, "Username too short");
        require(!users[msg.sender].isRegistered, "Already registered");
        
        users[msg.sender] = User({
            wallet: msg.sender,
            username: _username,
            avatarHash: _avatarHash,
            reputation: 0,
            isRegistered: true,
            createdAt: block.timestamp
        });
        
        emit UserRegistered(msg.sender, _username);
    }
    
    function createChannel(string memory _name, string memory _description, bool _isPrivate) 
        external onlyRegistered returns (uint256) 
    {
        require(bytes(_name).length >= 3, "Name too short");
        
        if (channelCreationCost > 0) {
            require(rewardToken.transferFrom(msg.sender, address(this), channelCreationCost), "Transfer failed");
        }
        
        channelCount++;
        uint256 channelId = channelCount;
        
        channels[channelId] = Channel({
            id: channelId,
            name: _name,
            description: _description,
            creator: msg.sender,
            memberCount: 1,
            isPrivate: _isPrivate,
            isActive: true,
            createdAt: block.timestamp
        });
        
        channelMembers[channelId][msg.sender] = true;
        userChannels[msg.sender].push(channelId);
        
        emit ChannelCreated(channelId, msg.sender, _name);
        return channelId;
    }
    
    function joinChannel(uint256 _channelId) external onlyRegistered {
        require(channels[_channelId].isActive, "Channel not active");
        require(!channelMembers[_channelId][msg.sender], "Already member");
        require(!channels[_channelId].isPrivate, "Private channel");
        
        channels[_channelId].memberCount++;
        channelMembers[_channelId][msg.sender] = true;
        userChannels[msg.sender].push(_channelId);
        
        emit ChannelJoined(_channelId, msg.sender);
    }
    
    function sendMessage(uint256 _channelId, string memory _contentHash) 
        external nonReentrant onlyRegistered 
    {
        require(channelMembers[_channelId][msg.sender], "Not a member");
        require(bytes(_contentHash).length > 0, "Empty content");
        require(block.timestamp >= lastMessageTime[msg.sender] + messageCooldown, "Cooldown active");
        
        messageCount++;
        uint256 messageId = messageCount;
        
        messages[messageId] = Message({
            id: messageId,
            channelId: _channelId,
            sender: msg.sender,
            contentHash: _contentHash,
            timestamp: block.timestamp,
            likes: 0,
            isPinned: false
        });
        
        lastMessageTime[msg.sender] = block.timestamp;
        
        if (messageReward > 0 && rewardToken.balanceOf(address(this)) >= messageReward) {
            require(rewardToken.transfer(msg.sender, messageReward), "Reward failed");
            users[msg.sender].reputation++;
            emit RewardDistributed(msg.sender, messageReward);
        }
        
        emit MessageSent(messageId, _channelId, msg.sender);
    }
    
    function likeMessage(uint256 _messageId) external onlyRegistered {
        require(messages[_messageId].id != 0, "Message not found");
        messages[_messageId].likes++;
        users[messages[_messageId].sender].reputation++;
        emit MessageLiked(_messageId, msg.sender);
    }
    
    function getUserChannels(address _user) external view returns (uint256[] memory) {
        return userChannels[_user];
    }
    
    function setMessageReward(uint256 _reward) external onlyOwner {
        messageReward = _reward;
    }
    
    function setChannelCreationCost(uint256 _cost) external onlyOwner {
        channelCreationCost = _cost;
    }
}
