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
    address public usdContractAddress;
    uint public vestingTime;
    struct Payment {
        uint amount;
        uint timestamp;
        uint price;
        uint tokensAmount;
        uint withdrawed;
        address from;
    }

    uint multiplier = 1000;

    struct Balance {
        uint totalPayments;
        uint totalUsd;
        uint totalPreparedTokens;
        Payment[] payments;
    }

    mapping(address => Balance) public balances;

    constructor (
        address _tokenAddress,
        address _usdContractAddress
        ) {
        tokenAddress = _tokenAddress;
        usdContractAddress = _usdContractAddress;
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
        (bool s,) = usdContractAddress.call(abi.encodeWithSelector(bytes4(keccak256(bytes('transferFrom(address,address,uint256)'))), msg.sender, address(this), amount));
        require(s, 'Transfer error');
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

    function changeMultiplier (uint _multiplier) public onlyOwner {
        multiplier = _multiplier;
    }

    function calculateMyWithdrawAvailable() public view returns (uint, uint) {
        uint amount = 0;
        for(uint i = 0; i <= balances[msg.sender].totalPayments - 1; i++) {
            if (block.timestamp - balances[msg.sender].payments[i].timestamp >= vestingTime) {
                amount += balances[msg.sender].payments[i].tokensAmount - balances[msg.sender].payments[i].withdrawed;
            } else {
                amount += (
                    (
                        multiplier * (block.timestamp - balances[msg.sender].payments[i].timestamp)
                        /
                        vestingTime
                    )
                    * balances[msg.sender].payments[i].tokensAmount
                    / multiplier
                    )  - balances[msg.sender].payments[i].withdrawed;
            }
        }
        return (amount, block.timestamp);
    }

    function claimMyMoney () public {
        uint amount = 0;
        for(uint i = 0; i <= balances[msg.sender].totalPayments - 1; i++) {
            if (block.timestamp - balances[msg.sender].payments[i].timestamp >= vestingTime) {
                uint money = balances[msg.sender].payments[i].amount;
                amount += money - balances[msg.sender].payments[i].withdrawed;
                balances[msg.sender].payments[i].withdrawed = money;
            } else {
                uint money = balances[msg.sender].payments[i].amount / (vestingTime / (block.timestamp - balances[msg.sender].payments[i].timestamp));
                amount += money - balances[msg.sender].payments[i].withdrawed;
                balances[msg.sender].payments[i].withdrawed += money - balances[msg.sender].payments[i].withdrawed;
            }
        }
        (bool status, ) = tokenAddress.call(abi.encodeWithSelector(bytes4(keccak256(bytes('transfer(address,uint256)'))), msg.sender, amount));
        require (status, 'transfer error');
    }

    function getMyFullAvailableWithdraw() public view returns (uint) {
        uint amount = 0;
        for(uint i = 0; i <= balances[msg.sender].totalPayments - 1; i++) {
            amount += balances[msg.sender].payments[i].tokensAmount;
        }
        return amount;
    }
}

