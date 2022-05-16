const { expect } = require('chai')
const helpers = require('../misc/testHelpers')

describe('PrivateSale Contract', async function () {
  let acc1
  let acc2
  let tokenContract
  let privateSaleContract
  let usdtContract;
  const defaultPrice = 50
  const defaultVesting = 300
  const defaultUsdAmount = 500

  beforeEach(async function () {
    [acc1, acc2] = await ethers.getSigners()
    tokenContract = await helpers.createTokenContract(acc1)
    usdtContract = tokenContract;
    privateSaleContract = await helpers.createPrivateSaleContract(acc1, tokenContract, usdtContract)
  })

  it('both contract should be deployed', async function () {
    expect(tokenContract.address).to.be.properAddress
    expect(privateSaleContract.address).to.be.properAddress
  })

  it('should have correct token contract address', async function () {
    const info = await privateSaleContract.tokenAddress()
    expect(info).to.be.eq(tokenContract.address)
  })

  it('should set price only by owner', async function () {
    let resultPrice = await privateSaleContract.tokenPrice()
    expect(resultPrice).to.be.eq(0)
    await privateSaleContract.setPrice(10)
    resultPrice = await privateSaleContract.tokenPrice()
    expect(resultPrice.toString()).to.be.eq('10')
    expect(privateSaleContract.connect(acc2).setPrice(100)).to.throw
  })

  async function migrateMoney () {
    const tx = await tokenContract.connect(acc1).transfer(privateSaleContract.address, 100000)
    await tx.wait()
    return tx
  }

  function setPrice () {
    return privateSaleContract.setPrice(defaultPrice)
  }

  function setVestingTime () {
    return privateSaleContract.changeVestingTime(defaultVesting)

  }

  async function buyDefaultAmount () {
    await usdtContract.approve(privateSaleContract.address, defaultUsdAmount);
    return privateSaleContract.buyToken(defaultUsdAmount)
  }

  it('should make migration of tokens from base account to private sale contract', async function () {
    expect(await tokenContract.balanceOf(privateSaleContract.address)).to.be.eq(0)
    await migrateMoney()
    expect((await tokenContract.balanceOf(privateSaleContract.address)).toString()).to.be.eq('100000')
  })

  it('should set normal price', async function () {
    await setPrice()
    expect(await privateSaleContract.tokenPrice()).to.be.eq(defaultPrice)
  })

  it('should buy token without errors', async function () {
    await migrateMoney()
    await setPrice()
    await buyDefaultAmount()
    const myData = await privateSaleContract.balances(acc1.address)
    expect(myData.totalPayments).to.be.eq(1)
    expect(myData.totalUsd).to.be.eq(defaultUsdAmount)
    expect(myData.totalPreparedTokens).to.be.eq(defaultUsdAmount / defaultPrice)
    const payments = await privateSaleContract.getMyPayments()
    expect(payments.length).eq(1)
    expect(payments[0].amount).eq(defaultUsdAmount)
    expect(payments[0].price).eq(defaultPrice)
    expect(payments[0].tokensAmount).eq(defaultUsdAmount / defaultPrice)
  })

  it('should calculate right debt and show it only to owner', async function () {
    const debt = await privateSaleContract.getTokenDebt()
    expect(debt).eq(0)
    expect(privateSaleContract.connect(acc2).getTokenDebt()).to.throw
    await migrateMoney()
    await setPrice()
    await buyDefaultAmount()
    const debtAfterBuy = await privateSaleContract.getTokenDebt()
    expect(debtAfterBuy).eq(defaultUsdAmount / defaultPrice)
  })

  it('should calculate full of my tokens to withdraw', async function () {
    await migrateMoney()
    await setPrice()
    await buyDefaultAmount()
    await buyDefaultAmount()
    const amount = await privateSaleContract.getMyFullAvailableWithdraw()
    expect(amount).eq(2 * defaultUsdAmount / defaultPrice)
  })

  it('should set vesting time correctly', async function () {
    await setVestingTime();
    const amount = await privateSaleContract.vestingTime()
    expect(amount).eq(defaultVesting);
  })

  async function mineNBlocks(n) {
    console.log('start mining')
    for (let index = 0; index < n; index++) {
      await ethers.provider.send('evm_mine');
      process.stdout.write(`*`);
    }
    console.log('finish mining')
  }

  it('should calculate right vesting time', async function () {
    await migrateMoney()
    await setPrice()
    await usdtContract.approve(privateSaleContract.address, defaultUsdAmount)
    await buyDefaultAmount()
    const tx = await setVestingTime();
    const payments = await privateSaleContract.getMyPayments()
    const timestampStart = payments[0].timestamp;
    await mineNBlocks(200);
    const availableWithdraw = await privateSaleContract.calculateMyWithdrawAvailable();
    const timestampEnd = availableWithdraw[1];
    const expectedWithdraw = Math.floor((defaultUsdAmount / defaultPrice) * (timestampEnd - timestampStart) / defaultVesting);
    expect(expectedWithdraw).eq(availableWithdraw[0]);
  })
})