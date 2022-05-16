(async function () {
  try {
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
    const signer = new ethers.providers.Web3Provider(web3Provider).getSigner();
    let tokenFactory = new ethers.ContractFactory(
      tokenMetadata.abi,
      tokenMetadata.data.bytecode.object,
      signer
    );
    let tokenContract = await tokenFactory.deploy("true");
    await tokenContract.deployed();
    let privateSaleFactory = new ethers.ContractFactory(
      privateSaleMetadata.abi,
      privateSaleMetadata.data.bytecode.object,
      signer
    );
    let privateSaleContract = await privateSaleFactory.deploy(
      tokenContract.address
    );
    await privateSaleContract.deployed();
  } catch (e) {
    console.log(e.message);
  }
})();
