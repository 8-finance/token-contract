// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/**
   * @title ContractName
   * @dev ContractDescription
   * @custom:dev-run-script ./deploy.js
   */
contract Token8FUpgradeableV1 is Initializable, ERC20Upgradeable, OwnableUpgradeable {

    function initialize() initializer public {
        __ERC20_init("8.Finance", "8F");
        __Ownable_init();
        burnTransferFee = 0;
        _mint(tx.origin, 888888888 * 1000000000000000000);
    }

    uint public burnTransferFee;
    uint constant feeMuplipier = 100000000;

    function setBurnTransferFee(uint feePercent) public onlyOwner {
        require (feePercent < 10000000000, "Percent must be less 100");
        burnTransferFee = feePercent / 100;
    }

    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        uint256 fee = amount * burnTransferFee / feeMuplipier;
        if (burnTransferFee > 0) {
            _burn(owner, fee);
        }
        _transfer(owner, to, amount - fee);
        return true;
    }
}

