//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface IToken {
    function balanceOf(address _owner) external view returns(uint256);
    function allowance(address _owner, address _spender) external view returns (uint256);
    function transfer(address _to, uint256 _value) external returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);
    function approve(address _spender, uint256 _value) external returns (bool success);
}

contract Staking {
    address public owner;
    address private tokenAddr;
    
    struct Staked {
        uint256 amount;
        uint256 reward;
        uint256 timeStamp;
    }
    mapping(address =>Staked) private balances;

    constructor(address _tokenAddr) {
        tokenAddr = _tokenAddr;
    }

    function stake(uint256 amount) public {
        require(balances[msg.sender].amount == 0, "Already staked");
        balances[msg.sender].amount = amount;
        balances[msg.sender].timeStamp = block.timestamp;
        IToken(tokenAddr).transferFrom(msg.sender, address(this), amount);

    }

    function claim() public {
        require(balances[msg.sender].reward != 0, "Zero reward");
        IToken(tokenAddr).transfer(msg.sender, balances[msg.sender].reward);
        balances[msg.sender].reward = 0;
        
    }

    function unstake() public {
        require(balances[msg.sender].amount != 0, "Zero balance staked");
        //IToken(tokenAddr).transfer(msg.sender, balances[msg.sender].amount);
        IToken(tokenAddr).transfer(msg.sender, balances[msg.sender].amount);
        balances[msg.sender].amount = 0;
    }

    function checkReward() public {
        require(block.timestamp - balances[msg.sender].timeStamp > 600, "Time not passed");
        balances[msg.sender].reward = balances[msg.sender].amount * 20 / 100;
    }
}
