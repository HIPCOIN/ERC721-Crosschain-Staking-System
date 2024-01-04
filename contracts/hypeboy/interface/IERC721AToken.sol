// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

pragma solidity ^0.8.4;

interface IERC721AToken {
    error ApprovalCallerNotOwnerNorApproved();
    error ApprovalQueryForNonexistentToken();
    error BalanceQueryForZeroAddress();
    error MintToZeroAddress();
    error MintZeroQuantity();
    error OwnerQueryForNonexistentToken();
    error TransferCallerNotOwnerNorApproved();
    error TransferFromIncorrectOwner();
    error TransferToNonERC721ReceiverImplementer();
    error TransferToZeroAddress();
    error URIQueryForNonexistentToken();
    error MintERC2309QuantityExceedsLimit();
    error OwnershipNotInitializedForExtraData();

    struct TokenOwnership {
        address addr;
        uint64 startTimestamp;
        bool burned;
        uint24 extraData;
    }

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event ConsecutiveTransfer(uint256 indexed fromTokenId, uint256 toTokenId, address indexed from, address indexed to);

    function transferOwnership(address newOwner) external;
    function maxSupply() external view returns (uint256);
    function airdrop(address _to, uint32 _amount) external;
    function burn(uint256 tokenId) external;
    function setMetadata(string calldata _metadataUri, string calldata _metadataSuffix) external;
    function setMaxSupply(uint256 _maxSupply) external;
    function pause() external;
    function unpause() external;
    function withdraw(uint256 _amount) external;
    function isWhiteListed(address _account, bytes32 _merkleRoot, bytes32[] memory _proof) external pure returns (bool);
    function leaf(address _account) external pure returns (bytes32);
    function totalSupply() external view returns (uint256);
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
    function balanceOf(address owner) external view returns (uint256 balance);
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external payable;
    function safeTransferFrom(address from, address to, uint256 tokenId ) external payable;
    function transferFrom(address from, address to, uint256 tokenId) external payable;
    function approve(address to, uint256 tokenId) external payable;
    function setApprovalForAll(address operator, bool _approved) external;
    function getApproved(uint256 tokenId) external view returns (address operator);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function tokenURI(uint256 tokenId) external view returns (string memory);

}
