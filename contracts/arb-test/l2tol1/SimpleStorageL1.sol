//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

contract SimpleStorageL1 {

    uint256 storeData = 100;

    event Change(string message, uint newVal);

    function set(uint256 x) public {
        require(x < 50000, "Should be less than 50000");
        storeData = x;
        emit Change("set", x);
    }

    function get() public view returns (uint) {
        return storeData;
    }


}