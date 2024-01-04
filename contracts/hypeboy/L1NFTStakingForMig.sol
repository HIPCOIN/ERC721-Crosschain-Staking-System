// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./interface/IERC721AToken.sol";

contract L1NFTStakingNewForMig {
    IERC721AToken token;

    constructor(IERC721AToken _token) {
        token = _token;
    }

    function claimable(
        uint16[] calldata _tokenIds,
        address _owner
    ) public view returns (bool) {
        bool result = true;
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            if (token.ownerOf(_tokenIds[i]) != _owner) result = false;
        }
        return result;
    }
}
