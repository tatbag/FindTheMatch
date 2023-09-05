//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CardToken is ERC721URIStorage {
   
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Card Token", "CDT") public { }

    function mint(address to, string memory tokenURI) public returns(bool) {
        _tokenIds.increment();
        uint256 newId = _tokenIds.current();
        _mint(to, newId);
        _setTokenURI(newId, tokenURI);
        return true;
    }

}
