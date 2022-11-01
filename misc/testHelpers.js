const { ethers, upgrades } = require("hardhat");

module.exports = {
  async createTokenContract (acc1) {
    const TokenContractData = await ethers.getContractFactory('Token8FUpgradeableV1', acc1)
    const tokenContract =  await upgrades.deployProxy(TokenContractData, [], {
      initializer: 'initialize'
    });
    await tokenContract.deployed()
    return tokenContract;
  },
  getTgePercent() {
    return 400000000;
  },
  async createPrivateSaleContract (acc1, tokenContract, usdtContract, nftContract) {
    const PrivateSaleContractData = await ethers.getContractFactory('PrivateSale8FUpgradeableV2', acc1)
    const privateSaleContract = await upgrades.deployProxy(PrivateSaleContractData,
      [tokenContract.address,usdtContract.address, nftContract.address, this.getTgePercent(), this.numberToStr(3000 * 1000000000000000000)], {
      initializer: 'initialize'
    })
    await privateSaleContract.deployed()
    return privateSaleContract;
  },
  async createStakingContract (acc1, tokenContract, fullTime, fullStakeMoney) {
    const StakingContractData = await ethers.getContractFactory('Staking8FUpgradeable', acc1)
    const stakingContract = await upgrades.deployProxy(StakingContractData, [tokenContract.address, fullTime, fullStakeMoney], {
      initializer: 'initialize'
    })
    await stakingContract.deployed()
    return stakingContract;
  },
  async createSimpleStakingContract (acc1, tokenContract, fullTime, fullStakeMoney) {
    const StakingContractData = await ethers.getContractFactory('StakingSimple8FUpgradeable', acc1)
    const stakingContract = await upgrades.deployProxy(StakingContractData, [tokenContract.address, fullTime], {
      initializer: 'initialize'
    })
    await stakingContract.deployed()
    return stakingContract;
  },
  async createPSNFTContract (acc1) {
    const NFTIDContractData = await ethers.getContractFactory('PrivateSaleNft8FContractV1', acc1)
    const nftidContract = await upgrades.deployProxy(NFTIDContractData, ["ipfs://QmVM5d4XWhoUkRnG2qhYUwLR2oKzNJUBmtpKeDFqxVmJKu"], {
      initializer: 'initialize'
    })
    await nftidContract.deployed()
    return nftidContract;
  },
  multiplier: 10 ** 18,
  numberToStr(number) {
    return number.toLocaleString('fullwide', {useGrouping:false})
  }
}