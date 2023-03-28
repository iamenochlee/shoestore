// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MegaToken is ERC20("MegaToken", "MEGA") {
    constructor(uint _supply) {
        _mint(msg.sender, _supply * 10 ** decimals());
    }

    receive() external payable {}

    fallback() external payable {}
}
