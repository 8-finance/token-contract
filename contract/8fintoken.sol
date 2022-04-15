// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract EightFinCon is ERC20 {
    constructor () ERC20("8fin_test", "8fin_test") {

        }
    function mint (uint256 amount) public {
        _mint(tx.origin, amount);
    }
    function burn (uint256 amount) public {
        _burn(tx.origin, amount);
    }
}

