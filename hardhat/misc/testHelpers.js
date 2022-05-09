module.exports = {
  async createTokenContract (acc1) {
    const TokenContractData = await ethers.getContractFactory('EightFinCon', acc1)
    const tokenContract = await TokenContractData.deploy(false)
    await tokenContract.deployed()
    return tokenContract;
  },
  async createPrivateSaleContract (acc1, tokenContract) {
    const PrivateSaleContractData = await ethers.getContractFactory('PrivateSale', acc1)
    const privateSaleContract = await PrivateSaleContractData.deploy(tokenContract.address)
    await privateSaleContract.deployed()
    return privateSaleContract;
  }
}