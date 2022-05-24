import { Web3Wrapper } from "./webConnector";

const abi = require("./privatesale.json");

export class PrivateSaleConnector {
  constructor(
    private web3Wrapper: Web3Wrapper,
    private addresses: {
      privateSale: string;
    }
  ) {}

  public async setPrice(price: number) {
    let contract = this.web3Wrapper.getContract(
      this.addresses.privateSale,
      abi
    );
    const method = contract.methods.setPrice(price);
    return this.web3Wrapper.sendMethod(method, {
      gasLimit: 1000000,
    });
  }

  public async changeVestingTime(time: number) {
    let contract = this.web3Wrapper.getContract(
      this.addresses.privateSale,
      abi
    );
    const method = contract.methods.changeVestingTime(time);
    return this.web3Wrapper.sendMethod(method, {
      gasLimit: 1000000,
    });
  }

  public async buyToken(amount: number) {
    let contract = this.web3Wrapper.getContract(
      this.addresses.privateSale,
      abi
    );
    const method = contract.methods.buyToken(amount);
    return this.web3Wrapper.sendMethod(method, {
      gasLimit: 1000000,
    });
  }
}
