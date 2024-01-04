//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "arbos-precompiles/arbos/builtin/ArbSys.sol";

contract SimpleStorageL2 {

    address simpleStorageL1;
    uint256 storeData = 200;

    ArbSys constant arbSys = ArbSys(0x0000000000000000000000000000000000000064);

    event Change(string message, uint newVal);

    constructor (address _addr) {
        simpleStorageL1 = _addr;
    }

    function set(uint256 x) public {
        require(x < 50000, "Should be less than 50000");
        storeData = x;
        emit Change("set", x);
    }

    function get() public view returns (uint) {
        return storeData;
    }

    function sendTxToL1 () external payable returns (uint256) {
        bytes memory data = abi.encodeWithSignature("set(uint256)", storeData);
        return arbSys.sendTxToL1(simpleStorageL1, data);
    }
    function getFromL1 () external payable returns (uint256) {
        bytes memory data = abi.encodeWithSignature("get()");
        return arbSys.sendTxToL1(simpleStorageL1, data);
    }
}

