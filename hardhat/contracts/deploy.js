(async function () {
  try {
    const signer1 = new ethers.providers.Web3Provider(web3Provider).getSigner(
      0
    );
    const signer2 = new ethers.providers.Web3Provider(web3Provider).getSigner(
      1
    );
    const tokenMetadata = JSON.parse(
      await remix.call(
        "fileManager",
        "getFile",
        "browser/artifacts/EightFinCon.json"
      )
    );

    const privateSaleMetadata = JSON.parse(
      await remix.call(
        "fileManager",
        "getFile",
        "browser/artifacts/PrivateSale.json"
      )
    );

    let tokenFactory = new ethers.ContractFactory(
      tokenMetadata.abi,
      tokenMetadata.data.bytecode.object,
      signer1
    );

    let tokenContract = await tokenFactory.deploy("true");

    await tokenContract.deployed();

    let privateSaleFactory = new ethers.ContractFactory(
      privateSaleMetadata.abi,
      privateSaleMetadata.data.bytecode.object,
      signer1
    );

    let privateSaleContract = await privateSaleFactory.deploy(
      tokenContract.address
    );

    await privateSaleContract.deployed();

    const tokenErc20_rw = new ethers.Contract(
      tokenContract.address,
      tokenMetadata.abi,
      signer1
    );

    const tx = await tokenErc20_rw.transfer(
      privateSaleContract.address,
      500000
    );
    await tx.wait();
    await privateSaleContract.setPrice(500);
    await privateSaleContract.changeVestingTime(600);
    const privateSaleContractAsSigner2 = await privateSaleContract.connect(
      signer2
    );
    await privateSaleContractAsSigner2.buyToken(50000);
    console.log("Done!");
  } catch (e) {
    console.log(e.message);
  }
})();
