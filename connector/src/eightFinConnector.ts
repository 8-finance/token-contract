import { Web3Wrapper } from "./webConnector";

const abi = require("./eightfin.json");

export class EightFinConnector {
  constructor(
    private web3Wrapper: Web3Wrapper,
    private addresses: {
      eightFin: string;
      usdtFin: string;
    }
  ) {}

  public async transfer(to: string, amount: number) {
    let contract = this.web3Wrapper.getContract(this.addresses.eightFin, abi);
    const method = contract.methods.transfer(to, amount);
    return this.web3Wrapper.sendMethod(method, {
      gasLimit: 1000000,
    });
  }

  public async transferFrom(from: string, to: string, amount: number) {
    let contract = this.web3Wrapper.getContract(this.addresses.eightFin, abi);
    const method = contract.methods.transferFrom(from, to, amount);
    return this.web3Wrapper.sendMethod(method, {
      gasLimit: 1000000,
    });
  }

  public async approve(spender: string, amount: number) {
    let contract = this.web3Wrapper.getContract(this.addresses.usdtFin, abi);
    const method = contract.methods.approve(spender, amount);
    return this.web3Wrapper.sendMethod(method, {
      gasLimit: 1000000,
    });
  }
}
