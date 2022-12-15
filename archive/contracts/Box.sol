// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Box is Ownable {
    uint256 private s_value;

    //Events
    event ValueChanged(uint256);

    function store(uint256 value) public onlyOwner {
        s_value = value;
        emit ValueChanged(value);
    }

    function getValue() public view returns (uint256) {
        return s_value;
    }
}
