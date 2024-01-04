// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@arbitrum/nitro-contracts/src/libraries/AddressAliasHelper.sol";
import "./ERC20Token.sol";

contract L2NFTStakingNew is Ownable {
  
  struct Stake {
    uint8 rarity;
    uint48 timestamp;
  }

  struct RewardInfo {
    uint256 rewardPerDay;
    uint256 max;
  }

  struct Claimable {
    uint16 tokenId;
    uint256 claimable;
  }

  event Claimed(address owner, uint256 amount);

  ERC20Token token;
  address l1Contract;

  mapping(uint8 => RewardInfo) public rewardInfo;
  mapping(uint256 => Stake) public vault; 

   constructor(ERC20Token _token) { 
    token = _token;
  }

  modifier onlyFromMyL1Contract() {
    require(AddressAliasHelper.undoL1ToL2Alias(msg.sender) == l1Contract, "ONLY_COUNTERPART_CONTRACT");
    _;
}

  function setL1Contract(address _l1Contract) external onlyOwner {
    l1Contract = _l1Contract;
  }
  function setTokenRarityRange(uint16 _startId, uint16 _endId, uint8 _rarity) external onlyOwner {
    require(_startId <= _endId, "Start id must be a number equal to or higher than end id.");
    for(uint256 i = _startId; i <= _endId; i++) {
      vault[i].rarity = _rarity;
    }
  }
  function setTokenRarityEach(uint16[] calldata _tokenIds, uint8 _rarity) external onlyOwner {
    uint16 tokenId;
    for(uint256 i = 0; i < _tokenIds.length; i++) {
      tokenId = _tokenIds[i];
      vault[tokenId].rarity = _rarity;
    }
  }
  function setTokenRarityEachToken(uint16[] calldata _tokenIds, uint8[] calldata _rarities) external onlyOwner {
    require(_tokenIds.length == _rarities.length, "Array must have same length.");
    uint16 tokenId;
    uint8 rarity;
    for(uint256 i = 0; i < _tokenIds.length; i++) {
      tokenId = _tokenIds[i];
      rarity = _rarities[i];
      vault[tokenId].rarity = rarity;
    }
  }
  function setTokenTimestampRange(uint16 _startId, uint16 _endId, uint48 _timestamp) external onlyOwner {
    require(_startId <= _endId, "Start id must be a number equal to or higher than end id.");
    for(uint256 i = _startId; i <= _endId; i++) {
      vault[i].timestamp = _timestamp;
    }
  }
  function setTokenTimestampEach(uint16[] calldata _tokenIds, uint48 _timestamp) external onlyOwner {
    uint256 tokenId;
    for(uint256 i = 0; i < _tokenIds.length; i++) {
      tokenId = _tokenIds[i];
      vault[tokenId].timestamp = _timestamp;
    }
  }
  function setTokenTimestampEachToken(uint16[] calldata _tokenIds, uint48[] calldata _timestamps) external onlyOwner {
    require(_tokenIds.length == _timestamps.length, "Array must have same length.");
    uint16 tokenId;
    uint48 timestamp;
    for(uint256 i = 0; i < _tokenIds.length; i++) {
      tokenId = _tokenIds[i];
      timestamp = _timestamps[i];
      vault[tokenId].timestamp = timestamp;
    }
  }
  function setRewardInfo(uint8 _rarity, uint256 _reward, uint256 _max) external onlyOwner {
    rewardInfo[_rarity].rewardPerDay = _reward;
    rewardInfo[_rarity].max = _max;
  }
  function withdrawReward(uint256 _amount) external onlyOwner {
    token.transfer(msg.sender, _amount);
  }
  function depositReward(uint256 _amount) external {
    token.transferFrom(msg.sender, address(this), _amount);
  }
  function encodeTokenId(uint16[] calldata _tokenIds) public view returns(bytes memory) {
        uint16[] memory tokenId = _tokenIds;
        bytes memory x = abi.encode(msg.sender, tokenId);
        return x;
  }
  function claim(bytes memory data) external onlyFromMyL1Contract {
     (address _sender, uint16[] memory _tokenIds) = abi.decode(data, (address, uint16[]));
      _claim(_sender, _tokenIds);
  }
  function claimable(uint16[] memory tokenIds) public view returns(uint256) {
    uint16 tokenId;
    uint256 earned = 0;
    uint256 rewardmath = 0;

    for(uint i = 0; i < tokenIds.length; i++) {
      tokenId = tokenIds[i];
      Stake memory staked = vault[tokenId];
      RewardInfo memory reward = rewardInfo[staked.rarity];
      uint256 stakedAt = staked.timestamp;
      rewardmath = reward.rewardPerDay * (block.timestamp - stakedAt) / 86400 ;
      uint256 rewardCalculate = rewardmath / 100;
      earned += Math.min(rewardCalculate, reward.max);
    }
    uint256 balance = token.balanceOf(address(this));
    earned = Math.min(earned, balance);
    return earned;
  }
  function claimableEach(uint16[] memory tokenIds) public view returns(Claimable[] memory) {
    uint16 tokenId;
    uint256 earned = 0;
    uint256 rewardmath = 0;
    Claimable[] memory claimableToken = new Claimable[](tokenIds.length);

    for(uint i = 0; i < tokenIds.length; i++) {
      tokenId = tokenIds[i];
      Stake memory staked = vault[tokenId];
      RewardInfo memory reward = rewardInfo[staked.rarity];
      uint256 stakedAt = staked.timestamp;
      rewardmath = reward.rewardPerDay * (block.timestamp - stakedAt) / 86400 ;
      uint256 rewardCalculate = rewardmath / 100;
      earned = Math.min(rewardCalculate, reward.max);
      Claimable memory _claimable = Claimable(tokenId, earned);
      claimableToken[i] = _claimable;
    }
    return claimableToken;
  }
  function expected(uint16[] memory tokenIds) public view returns(uint256) {
    uint16 tokenId;
    uint256 expect = 0;

    for(uint i = 0; i < tokenIds.length; i++) {
      tokenId = tokenIds[i];
      Stake memory staked = vault[tokenId];
      RewardInfo memory reward = rewardInfo[staked.rarity];
      expect += reward.rewardPerDay / 100;
    }
    return expect;
  }
  function _claim(address account, uint16[] memory tokenIds) internal {
    uint16 tokenId;
    uint256 earned = claimable(tokenIds);
    for(uint256 i = 0; i < tokenIds.length; i++) {
      tokenId = tokenIds[i];
      vault[tokenId].timestamp = uint48(block.timestamp);
    }
    if (earned > 0) {
      token.transfer(account, earned);
    }
    emit Claimed(account, earned);
  }


}
