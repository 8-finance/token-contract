import { Web3Wrapper } from "./webConnector";

const abi = require("eightfin.json");

export class EightFinConnector {
  constructor(
    private web3Wrapper: Web3Wrapper,
    private addresses: {
      eightFin: string;
    },
    private pkey: string
  ) {}

  public async transfer(from: string, to: string, amount: number) {
    let contract = this.web3Wrapper.getContract(this.addresses.eightFin, abi);
    const method = contract.methods
      .transfer(contract.options.address, to, amount)
      .encodeABI();
    let transactionConfig = {
      from: from,
      to: this.addresses.eightFin,
      nonce: await this.web3Wrapper.web3.eth.getTransactionCount(from),
      gas: 100000,
      gasPrice: await this.web3Wrapper.web3.eth.getGasPrice(),
      data: method,
    };
    console.log({ transactionConfig });
    const signedTx = await this.web3Wrapper.web3.eth.accounts.signTransaction(
      transactionConfig,
      this.pkey
    );

    console.log({ signedTx });
    const result =
      signedTx.rawTransaction &&
      (await this.web3Wrapper.web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (error, hash) {
          if (!error) {
            console.log(
              "🎉 The hash of your transaction is: ",
              hash,
              "\n Check Alchemy's Mempool to view the status of your transaction!"
            );
          } else {
            console.log(
              "❗Something went wrong while submitting your transaction:",
              error
            );
          }
        }
      ));
    return result;
  }

  public async balanceOf(address: string) {
    let contract = this.web3Wrapper.getContract(this.addresses.eightFin, abi);
    return contract.methods.balanceOf(address).encodeABI();
  }

  public async approve(spender: string, amount: number) {
    let contract = this.web3Wrapper.getContract(this.addresses.eightFin, abi);
    return contract.methods.approve(spender, amount).encodeABI();
  }

  public async name() {
    let contract = this.web3Wrapper.getContract(this.addresses.eightFin, abi);
    return contract.methods.name().encodeABI();
  }

  public async symbol() {
    let contract = this.web3Wrapper.getContract(this.addresses.eightFin, abi);
    return contract.methods.symbol().encodeABI();
  }

  public async testMode() {
    let contract = this.web3Wrapper.getContract(this.addresses.eightFin, abi);
    return contract.methods.testMode().encodeABI();
  }

  public async transferFrom(from: string, to: string, amount: number) {
    let contract = this.web3Wrapper.getContract(this.addresses.eightFin, abi);
    return contract.methods.transferFrom(from, to, amount).encodeABI();
  }

  public async allowance(owner: string, spender: string) {
    let contract = this.web3Wrapper.getContract(this.addresses.eightFin, abi);
    return contract.methods.allowance(owner, spender).encodeABI();
  }
}
