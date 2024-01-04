// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";
import "erc721a/contracts/extensions/ERC721AQueryable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "operator-filter-registry/src/DefaultOperatorFilterer.sol";

contract ERC721AToken is Ownable, ERC721A, ERC721AQueryable, Pausable, DefaultOperatorFilterer {
    using Strings for uint256;

    string private metadataUri;
    string private metadataSuffix = "";
    uint256 public maxSupply;

    constructor(
        string memory name,
        string memory symbol,
        uint256 _maxSupply
    ) ERC721A(name, symbol) {
        maxSupply = _maxSupply;
    }
    function _startTokenId() internal view virtual override(ERC721A) returns (uint256) {
        return 1;
    }
    function tokenURI(uint256 _tokenId) public view virtual override(ERC721A, IERC721A) returns (string memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(metadataUri, Strings.toString(_tokenId), metadataSuffix));
    }
    function airdrop(address _to, uint32 _amount) external onlyOwner {
        require(_totalMinted() + _amount <= maxSupply, "Mint : Exceed max supply amount.");
        _mint(_to, _amount);
    }
    function burn(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
    }
    function setMetadata(string calldata _metadataUri, string calldata _metadataSuffix) external onlyOwner {
        metadataUri = _metadataUri;
        metadataSuffix = _metadataSuffix;
    }
    function setMaxSupply(uint256 _maxSupply) external onlyOwner {
        maxSupply = _maxSupply;
    }
    function pause() public onlyOwner {
        _pause();
    }
    function unpause() public onlyOwner {
        _unpause();
    }
   function setApprovalForAll(address operator, bool approved) public override(ERC721A, IERC721A) onlyAllowedOperatorApproval(operator) {
        super.setApprovalForAll(operator, approved);
    }

    function approve(address operator, uint256 tokenId) public payable override(ERC721A, IERC721A) onlyAllowedOperatorApproval(operator) {
        super.approve(operator, tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId) public payable override(ERC721A, IERC721A) onlyAllowedOperator(from) {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public payable override(ERC721A, IERC721A) onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public payable override(ERC721A, IERC721A) onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId, data);
    }
}
