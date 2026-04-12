// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VipCardNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor() ERC721("GreenMarket VIP Pass", "GMVIP") Ownable(msg.sender) {}

    function mintVIPCard(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
    
    function currentTokenId() public view returns (uint256) {
        return _nextTokenId;
    }
}
