// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract PrivateSale is Ownable {
    address public tokenAddress;
    uint public tokenPrice;

    constructor (address _tokenAddress) {
        tokenAddress = _tokenAddress;
    }

    function setPrice(uint _tokenPrice) public onlyOwner {
        tokenPrice = _tokenPrice;
    }

    function buyToken(uint amount) {

    }
}

