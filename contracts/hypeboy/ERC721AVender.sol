// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "erc721a/contracts/IERC721A.sol";

contract vender is AccessControl {

    IERC721A public ERC721;
    address public teamWallet;

    enum SaleStatus {
        NO_SALE,
        OG_1_SALE,
        OG_2_SALE,
        OG_3_SALE,
        WL_SALE,
        PB_SALE
    }
    struct MintStatus {
        uint32 minted;
        uint256 price;
        uint32 max;
        uint8 perTx;
        uint8 perWallet;
        bytes32 merkleRoot;
    }

    SaleStatus public saleStatus = SaleStatus.NO_SALE;
    mapping(uint8 => mapping(address => uint256)) public mintLogs;
    mapping(uint8 => MintStatus) public mintStatus;
    
    uint256 public tokenId;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        teamWallet = msg.sender;
        tokenId = 1;
    }
    function withdraw(uint256 _amount) public onlyRole(DEFAULT_ADMIN_ROLE) {
        payable(msg.sender).transfer(_amount);
    }
    function setSaleStatus(SaleStatus _saleStatus) external onlyRole(DEFAULT_ADMIN_ROLE) {
        saleStatus = _saleStatus;
    }
    function setWhitelist(SaleStatus _saleStatus, bytes32 _merkleRoot) external onlyRole(DEFAULT_ADMIN_ROLE) {
        mintStatus[uint8(_saleStatus)].merkleRoot = _merkleRoot;
    }
    function setTokenId(uint256 _tokenId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        tokenId = _tokenId;
    }
    function setSaleMinted(SaleStatus _saleStatus, uint32 _minted) external onlyRole(DEFAULT_ADMIN_ROLE) {
        mintStatus[uint8(_saleStatus)].minted = _minted;
    }
    function setMintStatus(SaleStatus _saleStatus, uint256 _price, uint32 _max, uint8 _perTx, uint8 _perWallet) external onlyRole(DEFAULT_ADMIN_ROLE) {
        mintStatus[uint8(_saleStatus)].price = _price;
        mintStatus[uint8(_saleStatus)].perTx = _perTx;
        mintStatus[uint8(_saleStatus)].max = _max;
        mintStatus[uint8(_saleStatus)].perWallet = _perWallet;
    }
    function setERC721 (IERC721A _address) external onlyRole(DEFAULT_ADMIN_ROLE) {
        ERC721 = _address;
    }
    function setTeamWallet (address _address) external onlyRole(DEFAULT_ADMIN_ROLE) {
        teamWallet = _address;
    }
    function isWhiteListed(address _account, bytes32 _merkleRoot, bytes32[] memory _proof) public pure returns (bool) {
        return _merkleRoot == 0x0 || MerkleProof.verify(_proof, _merkleRoot, leaf(_account));
    }
    function leaf(address _account) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_account));
    }
    function mint(uint32 _amount, bytes32[] memory _proof) external payable {
        uint8 sale = uint8(saleStatus);
        MintStatus memory status = mintStatus[sale];
        uint256 minted = mintLogs[sale][msg.sender];
        require(sale != 0, "Mint : Disabled mint schedule.");
        require(msg.value == status.price * _amount, "Mint : Invalid value.");
        require(isWhiteListed(msg.sender, status.merkleRoot, _proof), "Mint : Not allowed wallet address.");
        require(status.minted + _amount <= status.max, "Mint : Sold out for this round.");
        require(_amount <= status.perTx, "Mint : Exceeds amount per transaction.");
        require(minted + _amount <= status.perWallet, "Mint : Exceeds amount per wallet amount.");
        uint256 token = tokenId;
        for(uint32 i = 0; i < _amount; i++) {
            ERC721.transferFrom(teamWallet, msg.sender, token + i);
        }
        payable(teamWallet).transfer(msg.value);
        mintLogs[sale][msg.sender] += _amount;
        mintStatus[sale].minted += _amount;
        tokenId += _amount;
    }
}