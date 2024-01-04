// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

pragma solidity ^0.8.4;

interface IL2NFTStakingNew {
    struct Stake {
        uint8 rarity;
        uint48 timestamp;
    }

    function vault(uint256 tokenId) external view returns (Stake memory);
}
