// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract ERC20Interface {
    function balanceOf(address whom) view virtual public returns (uint);
}

contract PrivateSale is Ownable {
    address public tokenAddress;
    uint public tokenPrice;
    uint tokenDebt;
    uint vestingTime;
    struct Payment {
        uint amount;
        uint timestamp;
        uint price;
        uint tokensAmount;
        uint withdrawed;
        address from;
    }

    struct Balance {
        uint totalPayments;
        uint totalUsd;
        uint totalPreparedTokens;
        Payment[] payments;
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
    function changeVestingTime (uint time) public onlyOwner {
        vestingTime = time;
    }
    // Amount is transfered now. Later it will be native erc-20 transfer of usdt by approvance
    function buyToken(uint amount) public {
        require(tokenPrice > 0, "Token price must be not zero");
        uint byBalance = ERC20Interface(tokenAddress).balanceOf(address(this));
        uint tokensAmount = amount / tokenPrice;
        require((tokenDebt + tokensAmount) < byBalance, "Not enoung tokens on PS contract");
        balances[msg.sender].totalPayments++;

        Payment memory newPayment = Payment(
            amount,
            block.timestamp,
            tokenPrice,
            tokensAmount,
            0,
            msg.sender
        );
        balances[msg.sender].totalUsd += amount;
        balances[msg.sender].totalPreparedTokens += amount / tokenPrice;
        balances[msg.sender].payments.push(newPayment);
        tokenDebt+=tokensAmount;
    }

    function getMyPayments () public view returns (Payment[] memory) {
        return balances[msg.sender].payments;
    }

    function getTokenDebt () public view onlyOwner returns (uint)  {
        return tokenDebt;
    }

    function calculateMyWithdrawAvailable() public view returns (uint) {
        uint amount = 0;
        for(uint i = 0; i <= balances[msg.sender].totalPayments - 1; i++) {
            if (block.timestamp - balances[msg.sender].payments[i].timestamp >= vestingTime) {
                amount += balances[msg.sender].payments[i].amount;
            } else {
                amount += balances[msg.sender].payments[i].amount / (vestingTime / (block.timestamp - balances[msg.sender].payments[i].timestamp));
            }
        }
        return amount;
    }

    function calculatePaymentWithdrawAvailable(Payment memory payment) public view returns (uint amount) {
        amount = payment.tokensAmount;
    }
}

