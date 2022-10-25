// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.8.2 <= 0.8.4;
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Token8FUpgradeableV1 is Initializable, ERC20Upgradeable, OwnableUpgradeable {

    function initialize() initializer public {
        __ERC20_init("8.Finance", "8F");
        __Ownable_init();
        _mint(_msgSender(), 888888888 * 1000000000000000000);
    }

    uint256 public burnTransferFee;
    uint256 private constant FEE_MULTIPLIER = 100000000;

    function setBurnTransferFee(uint256 feePercent) external onlyOwner {
        require (feePercent < 100000000, "Percent must be less 100");
        emit BurnTransferFeeChanged(feePercent);
        burnTransferFee = feePercent;
    }

    function _transfer(address from, address to, uint256 amount) internal override {
        address owner = from;
        uint256 fee = amount * burnTransferFee / FEE_MULTIPLIER;
        if (fee > 0) {
            _burn(owner, fee);
        }
        super._transfer(owner, to, amount - fee);
    }

    event BurnTransferFeeChanged(uint256 newBurnTransferFee);
}

