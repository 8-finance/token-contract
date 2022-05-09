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
    expect(supply.toString()).to.eq('1000000000000000000000000000')
  })
})