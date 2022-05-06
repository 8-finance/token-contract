// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract ERC20Interface {
    function balanceOf(address whom) view virtual public returns (uint);
}

contract PrivateSale is Ownable {
    address public tokenAddress;
    uint public tokenPrice;
    uint public tokenDebt;

    struct Payment {
        uint amount;
        uint timestamp;
        uint price;
        address from;
    }

    struct Balance {
        uint totalPayments;
        uint totalUsd;
        uint totalPreparedTokens;
        mapping(uint => Payment) payments;
    }

    mapping(address => Balance) public balances;

    constructor (address _tokenAddress) {
        tokenAddress = _tokenAddress;
    }

    function setPrice(uint _tokenPrice) public onlyOwner {
        tokenPrice = _tokenPrice;
    }

    function getTokenBalance(address addr) public view returns (uint byBalance) { //todo delete 
        byBalance = ERC20Interface(tokenAddress).balanceOf(addr);
    }

    // Amount is transfered now. Later it will be native erc-20 transfer of usdt by approvance
    function buyToken(uint amount) public {
        require(tokenPrice > 0, "Token price must be not zero");
        uint byBalance = ERC20Interface(tokenAddress).balanceOf(address(this));
        uint amountOfTokens = amount / tokenPrice;
        require((tokenDebt + amountOfTokens) < byBalance, "Not enoung tokens on PS contract");
        uint paymentNum = balances[msg.sender].totalPayments;
        balances[msg.sender].totalPayments++;

        Payment memory newPayment = Payment(
            amount,
            block.timestamp,
            tokenPrice,
            msg.sender
        );
        balances[msg.sender].totalUsd += amount;
        balances[msg.sender].totalPreparedTokens += amount / tokenPrice;
        balances[msg.sender].payments[paymentNum] = newPayment;
        tokenDebt+=amountOfTokens;
    }
}

