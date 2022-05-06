const { expect } = require('chai')

describe('TokenContract', function () {
  let acc1
  let acc2
  let tokenContract

  beforeEach(async function () {
    [acc1, acc2] = await ethers.getSigners()
    const TokenContractData = await ethers.getContractFactory('EightFinCon', acc1)
    tokenContract = await TokenContractData.deploy(false)
    await tokenContract.deployed()
  })

  it('should be deployed', async function () {
    expect(tokenContract.address).to.be.properAddress
  })

  it('should have 0 ether by default', async function () {
    const balance = await tokenContract.balanceOf(tokenContract.address)
    expect(balance).to.eq(0)
  })

  it('should have right totalSupply', async function () {
    const supply = await tokenContract.totalSupply()
    expect(supply.toString()).to.eq('1000000000000000000000000000')
  })

  // it("should be possible to send funds", async function() {
  //   const sum = 100
  //   const msg = "hello from hardhat"
  //   const tx = await tokenContract.connect(acc2).pay(msg, { value: sum })
  //
  //   await expect(() => tx)
  //     .to.changeEtherBalances([acc2, tokenContract], [-sum, sum]);
  //
  //   await tx.wait()
  //
  //   const newPayment = await tokenContract.getPayment(acc2.address, 0)
  //   expect(newPayment.message).to.eq(msg)
  //   expect(newPayment.amount).to.eq(sum)
  //   expect(newPayment.from).to.eq(acc2.address)
  // })
})

describe('PrivateSale Contract', async function () {
  let acc1
  let acc2
  let tokenContract
  let privateSaleContract

  beforeEach(async function () {
    [acc1, acc2] = await ethers.getSigners()
    const TokenContractData = await ethers.getContractFactory('EightFinCon', acc1)
    tokenContract = await TokenContractData.deploy(false)
    await tokenContract.deployed()
    const PrivateSaleContractData = await ethers.getContractFactory('PrivateSale', acc1)
    privateSaleContract = await PrivateSaleContractData.deploy(tokenContract.address)
    await privateSaleContract.deployed()
  })

  it('both contract should be deployed', async function () {
    expect(tokenContract.address).to.be.properAddress
    expect(privateSaleContract.address).to.be.properAddress
  })

  it('should have correct token contract address', async function () {
    const info = await privateSaleContract.tokenAddress()
    expect(info).to.be.eq(tokenContract.address)
  })
})