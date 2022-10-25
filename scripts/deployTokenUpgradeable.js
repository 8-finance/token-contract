const { ethers, upgrades } = require('hardhat')
let eightFinConUpgradeable

function deployMessage (result, name) {
  name = name || 'Contract'
  console.log(
    `${name} deployed.\nHash:`,
    result.deployTransaction.hash,
    '\nAddress: ',
    result.address,
    '\nGas taken:',
    result.deployTransaction.gasLimit.toString(),
    '\nGas price:',
    result.deployTransaction.gasPrice.toString(),
    '\nFee in wei:',
    (result.deployTransaction.gasPrice * result.deployTransaction.gasLimit / 1000000000000000000).toString(),
  )
}

async function main () {
  const EightFinConUpgradeable = await ethers.getContractFactory(
    'Token8FUpgradeableV1'
  )

  eightFinConUpgradeable = await upgrades.deployProxy(
    EightFinConUpgradeable,
    [],
    {
      initializer: 'initialize',
    }
  )

  const result = await eightFinConUpgradeable.deployed()

  deployMessage(result, '8F Coin')
}

(async () => {
  await main()
})()
