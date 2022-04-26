// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract EightFinCon is ERC20 {
    bool public testMode;

    constructor (bool testModeVar) ERC20("8fin_test", "8fin_test") {
            testMode = testModeVar;
            _mint(tx.origin, 1000000000000000000000000000);
        }
    function mint (uint256 amount) public {
        require(testMode, 'No testmode activated');
        _mint(tx.origin, amount);
    }
    function burn (uint256 amount) public {
        require(testMode, 'No testmode activated');
        _burn(tx.origin, amount);
    }
}

