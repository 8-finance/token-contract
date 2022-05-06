// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
contract PrivateSale {
    address public tokenAddress;

    constructor (address _tokenAddress) {
        tokenAddress = _tokenAddress;
    }
}

