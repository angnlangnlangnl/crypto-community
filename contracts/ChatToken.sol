// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChatToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 10000000 * 10**18;
    
    mapping(address => uint256) public lastMiningTime;
    uint256 public miningCooldown = 1 hours;
    uint256 public miningReward = 10 * 10**18;
    
    event TokensMined(address indexed miner, uint256 amount);
    
    constructor() ERC20("Chat Community Token", "CHAT") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10**18);
    }
    
    function mine() external {
        require(totalSupply() + miningReward <= MAX_SUPPLY, "Max supply reached");
        require(block.timestamp >= lastMiningTime[msg.sender] + miningCooldown, "Mining cooldown active");
        
        lastMiningTime[msg.sender] = block.timestamp;
        _mint(msg.sender, miningReward);
        
        emit TokensMined(msg.sender, miningReward);
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
}
