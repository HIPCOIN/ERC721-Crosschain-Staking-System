// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./interface/IL2NFTStakingNew.sol";

contract L2NFTStakingForMig {
    IL2NFTStakingNew target;

    struct Stake {
        uint8 rarity;
        uint48 timestamp;
    }

    constructor(IL2NFTStakingNew _address) {
        target = _address;
    }

    function getVault(
        uint16[] memory tokenIds
    ) public view returns (Stake[] memory) {
        Stake[] memory result = new Stake[](tokenIds.length);

        for (uint i = 0; i < tokenIds.length; i++) {
            result[i].timestamp = target.vault(tokenIds[i]).timestamp;
            result[i].rarity = target.vault(tokenIds[i]).rarity;
        }

        return result;
    }
}
