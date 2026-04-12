// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LoyaltyToken is ERC20, Ownable {
    constructor() ERC20("GreenMarket Loyalty Points", "GLP") Ownable(msg.sender) {
        // Mint some initial supply to the owner (e.g., 1 million tokens with 18 decimals)
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
