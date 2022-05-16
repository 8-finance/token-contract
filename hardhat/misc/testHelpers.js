module.exports = {
  async createTokenContract (acc1) {
    const TokenContractData = await ethers.getContractFactory('EightFinCon', acc1)
    const tokenContract = await TokenContractData.deploy(false)
    await tokenContract.deployed()
    return tokenContract;
  },
  async createPrivateSaleContract (acc1, tokenContract, usdtContract) {
    const PrivateSaleContractData = await ethers.getContractFactory('PrivateSale', acc1)
    const privateSaleContract = await PrivateSaleContractData.deploy(tokenContract.address,usdtContract.address)
    await privateSaleContract.deployed()
    return privateSaleContract;
  }
}