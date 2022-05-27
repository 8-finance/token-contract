import Web3 from 'web3';
import { Contract, ContractSendMethod } from 'web3-eth-contract';

const debug = require('debug')('web3_connector');

export type ConnectorConfig = { nodeUrl: string, privateKey?: string, maxTxFee?: number };

export class Web3Wrapper {
  get web3(): Web3 {
    return this._web3;
  }

  public maxFee = 0.01;

  constructor(private _web3: Web3) {
  }

  async sendMethod(method: ContractSendMethod,
                   overrideConfig?: {
                     gasLimit: number
                   }
  ) {
    let price = await this.web3.eth.getGasPrice();
    const calPrice = parseInt(price);
    let gas = overrideConfig?.gasLimit ?? await method.estimateGas();
    debug('TX Gas info');
    const maxPrice = Math.floor(Math.pow(10, 16) * this.maxFee / gas);
    price = Math.min(calPrice, maxPrice).toString();
    debug({
      gasCalculated: gas,
      feeMax: this.maxFee,
      calPrice,
      maxPrice,
      price
    });
    let address = this.getAddress();
    let gasPrice = (Number(price) * 100).toString();
    return method.send({
      from: address,
      gas,
      gasPrice,
      nonce: await this.web3.eth.getTransactionCount(address)
    });
  }

  public getAddress() {
    return this._web3.eth.accounts.wallet[0].address;
  }

  async callMethod(method: ContractSendMethod) {
    return method.call({from: this.getAddress()});
  }

  public getContract(address: string, abi: any): Contract {
    return new this._web3.eth.Contract(abi, address);
  }
}

export class Web3Connector {
  private _web3Connections: {
    [key: string]: Web3Wrapper
  };

  constructor() {
    this._web3Connections = {};
  }

  public getWeb3Connected(config: ConnectorConfig): Web3Wrapper {
    const key = JSON.stringify(config);
    if (this._web3Connections[key] === undefined) {
      const {nodeUrl, privateKey} = config;
      const web3 = new Web3(nodeUrl);
      let account;
      if (privateKey) {
        account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
        web3.eth.accounts.wallet.add(account);
      }

      this._web3Connections[key] = new Web3Wrapper(web3);
    }

    return this._web3Connections[key];
  }
}
