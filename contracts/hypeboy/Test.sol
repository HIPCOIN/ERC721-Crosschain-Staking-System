// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract A {

    struct Result {
        address sender;
        uint256 tokenId;
    }

    function foo(uint256[] calldata _tokenIds) public view returns(bytes memory) {
        uint256[] memory tokenId = _tokenIds;
        bytes memory x = abi.encode(msg.sender, tokenId);
        return x;
    }
    
    
    function bar(bytes memory data) public pure returns(address, uint256[] memory) {
        (address _sender, uint256[] memory _tokenIds) = abi.decode(data, (address, uint256[]));

    
        return (_sender, _tokenIds);
    }
}