// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
// import "erc721a/contracts/interfaces/IERC721A.sol";
import "./interface/IERC721AToken.sol";
import "@arbitrum/nitro-contracts/src/bridge/IInbox.sol";

contract L1NFTStakingNew is Ownable {

  /* Arbitrum Delayed Inbox 
  Goerli - 0x6BEbC4925716945D46F0Ec336D5C2564F419682C
  Mainnet - 0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f */
  IInbox constant inbox = IInbox(0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f);
  IERC721AToken token;
  address l2Contract;

  event Claimed(uint256 indexed msgNo);

  constructor(IERC721AToken _token) { 
    token = _token;
  }
  function setL2Contract(address _l2Contract) external onlyOwner {
    l2Contract = _l2Contract;
  }
  function setTokenContract(IERC721AToken _nftContract) external onlyOwner {
    token = _nftContract;
  }
  function ownerOf(uint256 _tokenId) external view returns(address) {
    return token.ownerOf(_tokenId);
  }

  function claim(uint16[] calldata _tokenIds, uint256 maxSubmissionCost, uint256 maxGas, uint256 gasPriceBid) public payable returns(uint256) {
    for(uint256 i = 0; i < _tokenIds.length; i++) {
      require(token.ownerOf(_tokenIds[i]) == msg.sender, "Not your token.");
    }
    uint16[] memory tokenId = _tokenIds;
    bytes memory x = abi.encode(msg.sender, tokenId);
    bytes memory data = abi.encodeWithSignature("claim(bytes)", x);

    uint256 msgNo = inbox.createRetryableTicket{ value : msg.value }(
      l2Contract,
      0,
      maxSubmissionCost,
      msg.sender,
      msg.sender,
      maxGas,
      gasPriceBid,
      data
    );

    emit Claimed(msgNo);
    return msgNo;
  }

}
