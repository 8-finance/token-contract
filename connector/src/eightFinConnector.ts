import { Web3Wrapper } from "./webConnector";

const abi = require("./eightfin.json");

export class EightFinConnector {
  constructor(
    private web3Wrapper: Web3Wrapper,
    private addresses: {
      eightFin: string;
    }
  ) {
  }

  public async transfer(to: string, amount: number) {
    let contract = this.web3Wrapper.getContract(this.addresses.eightFin, abi);
    const method = contract.methods.transfer(to, amount);
    return this.web3Wrapper.sendMethod(method, {
      gasLimit: 1000000
    });
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
