const { expect } = require("chai");

describe("Payments", function () {
  let acc1
  let acc2
  let payments

  beforeEach(async function() {
    [acc1, acc2] = await ethers.getSigners()
    const Payments = await ethers.getContractFactory("EightFinCon", acc1)
    payments = await Payments.deploy(false)
    await payments.deployed()
  })

  it("should be deployed", async function() {
    expect(payments.address).to.be.properAddress
  })

  it("should have 0 ether by default", async function() {
    const balance = await payments.balanceOf(payments.address)
    expect(balance).to.eq(0)
  })

  it("should have right totalSupply", async function () {
    const supply = await payments.totalSupply()
    expect(supply.toString()).to.eq("1000000000000000000000000000")
  })

  // it("should be possible to send funds", async function() {
  //   const sum = 100
  //   const msg = "hello from hardhat"
  //   const tx = await payments.connect(acc2).pay(msg, { value: sum })
  //
  //   await expect(() => tx)
  //     .to.changeEtherBalances([acc2, payments], [-sum, sum]);
  //
  //   await tx.wait()
  //
  //   const newPayment = await payments.getPayment(acc2.address, 0)
  //   expect(newPayment.message).to.eq(msg)
  //   expect(newPayment.amount).to.eq(sum)
  //   expect(newPayment.from).to.eq(acc2.address)
  // })
})