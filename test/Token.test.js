const { expect } = require('chai')
const helpers = require('../misc/testHelpers')

describe('TokenContract', function () {
  let acc1
  let acc2
  let tokenContract

  beforeEach(async function () {
    [acc1, acc2] = await ethers.getSigners()
    tokenContract = await helpers.createTokenContract(acc1)
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
    expect(supply.toString()).to.eq('888888888000000000000000000')
  })

  it('should set up right burn fee', async function () {
    expect(await tokenContract.burnTransferFee()).eq(0)
    await tokenContract.setBurnTransferFee(1000000)
    expect(await tokenContract.burnTransferFee()).eq(1000000)
  })

  it('should take transfer fee', async function () {
    await tokenContract.setBurnTransferFee(1000000)
    const [initBalanceAcc1, initBalanceAcc2] = [await tokenContract.balanceOf(acc1.address), await tokenContract.balanceOf(acc2.address)]
    await tokenContract.connect(acc1).transfer(acc2.address, helpers.numberToStr(100 * 10 ** 18))
    const [afterBalanceAcc1, afterBalanceAcc2] = [await tokenContract.balanceOf(acc1.address), await tokenContract.balanceOf(acc2.address)]
    expect(initBalanceAcc1).eq('888888888000000000000000000')
    expect(initBalanceAcc2).eq('0')
    expect(afterBalanceAcc1).eq('888888788000000000000000000')
    expect(afterBalanceAcc2).eq('99000000000000000000')
  })

  it('should NOT take transfer fee', async function () {
    const [initBalanceAcc1, initBalanceAcc2] = [await tokenContract.balanceOf(acc1.address), await tokenContract.balanceOf(acc2.address)]
    await tokenContract.connect(acc1).transfer(acc2.address, (100 * Math.pow(10, await tokenContract.decimals())).toString())
    const [afterBalanceAcc1, afterBalanceAcc2] = [await tokenContract.balanceOf(acc1.address), await tokenContract.balanceOf(acc2.address)]
    expect(initBalanceAcc1).eq('888888888000000000000000000')
    expect(initBalanceAcc2).eq('0')
    expect(afterBalanceAcc1).eq('888888788000000000000000000')
    expect(afterBalanceAcc2).eq('100000000000000000000')
  })
})