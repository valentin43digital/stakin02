// contracts/Token.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address public owner;

    modifier ownerOnly() {
        require(msg.sender == owner, "You are not owner");
        _;
    }

    constructor(
        string memory newName,
        string memory newSymbol,
        uint256 newTotalSupply
        ) ERC20(newName, newSymbol) {
        owner = msg.sender;
        _mint(msg.sender, newTotalSupply);
    }

    function mint(address account, uint256 amount) public ownerOnly {
        _mint(account, amount);
    }
}