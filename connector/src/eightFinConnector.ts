import { Web3Wrapper } from './webConnector';

const abi = require('eightfin.json');

export class EightFinConnector {
  constructor(
    private web3Wrapper: Web3Wrapper,
    private addresses: {
      eightFin: string
    },
    private pkey: string,
  ) {
  }

  public async transfer(from: string, to: string, amount: number) {
    let contract = this.web3Wrapper.getContract(this.addresses.eightFin, abi);
    const method = contract.methods.transfer(to, amount).encodeABI();
    let transactionConfig = {
      from: from,
      to: this.addresses.eightFin,
      nonce: await this.web3Wrapper.web3.eth.getTransactionCount(from),
      gas: 100000,
      gasPrice: await this.web3Wrapper.web3.eth.getGasPrice(),
      data: contract.methods.transfer('0x8E668DE2E2318f6C53E0A84b1f8f5065C0aA094b', '1').encodeABI(),
    };
    console.log({transactionConfig});
    const signedTx = await this.web3Wrapper.web3.eth.accounts.signTransaction(transactionConfig, this.pkey);

    console.log({signedTx});
    const result = signedTx.rawTransaction && await this.web3Wrapper.web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, hash) {
      if (!error) {
        console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
      } else {
        console.log("❗Something went wrong while submitting your transaction:", error);
      }
    });
    return result;
  }
}