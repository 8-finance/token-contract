(async function () {
  try {
    const defaultPrice = 50;
    const defaultVesting = 300;
    const defaultUsdAmount = 500;
    const [acc1, acc2] = await ethers.getSigners();
    const TokenContractData = await ethers.getContractFactory(
      "EightFinCon",
      acc1
    );
    const tokenContract = await TokenContractData.deploy(false);
    await tokenContract.deployed();
    const usdtContractData = await ethers.getContractFactory(
      "EightFinCon",
      acc1
    );
    const usdtContract = await usdtContractData.deploy(false);
    await usdtContract.deployed();
    const PrivateSaleContractData = await ethers.getContractFactory(
      "PrivateSale",
      acc1
    );
    const privateSaleContract = await PrivateSaleContractData.deploy(
      tokenContract.address,
      usdtContract.address
    );
    await privateSaleContract.deployed();
    const tx = await tokenContract
      .connect(acc1)
      .transfer(privateSaleContract.address, 100000);
    await tx.wait();
    privateSaleContract.setPrice(defaultPrice);
    privateSaleContract.changeVestingTime(defaultVesting);
    await usdtContract.approve(privateSaleContract.address, defaultUsdAmount);
    privateSaleContract.connect(acc2).buyToken(defaultUsdAmount);
    console.log("Done!");
  } catch (e) {
    console.log(e.message);
  }
})();
