require('dotenv').config()
require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-ethers')
require('@openzeppelin/hardhat-upgrades')
require('@nomiclabs/hardhat-etherscan')

console.log(process.env.API_KEY)
console.log(process.env.PRIVATE_KEY.slice(0, 64))
const accounts = process.env.PRIVATE_KEY ? [`${process.env.PRIVATE_KEY.slice(0, 64)}`] : []
console.log(accounts)
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4',
  mocha: {
    timeout: 120000
  },
  networks: {
    hardhat: {},
    bsc: {
      url: 'https://bsc-dataseed1.binance.org/',
      accounts
    },
    bscTestnet: {
      url: 'https://data-seed-prebsc-1-s3.binance.org:8545/',
      accounts
    },
    ropsten: {
      url: ``,
      accounts
    },
    kovan: {
      url: 'https://eth-kovan.alchemyapi.io/v2/zwvYdNuq-yvmMeQOe7TZDKge7MIA0v6N',
      accounts
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/Xz_UTEf4L171Defl0rCWPF8Q19LM0rBQ`,
      accounts
    }
  },
  etherscan: {
    apiKey: {
      goerli: `${process.env.API_KEY_KOVAN}`,
      bscTestnet: `${process.env.API_KEY}`,
      bsc: `${process.env.API_KEY}`,
      kovan: `${process.env.API_KEY_KOVAN}`
    }
  }
}
