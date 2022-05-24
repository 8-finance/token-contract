import { Web3Connector } from "./webConnector";
import { EightFinConnector } from "./eightFinConnector";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "4fc2473367316e633a030199f752f540312149f48361468661bc546ee3bfb70c";
const EIGHT_FIN_TOKEN = process.env.TOKEN_CONTRACT || "0x8fa7C0ed0E10175147dE8C6A9330b164Fe420561";
let NODE_URL = process.env.NODE_URL || "https://data-seed-prebsc-1-s1.binance.org:8545";


const web3Connector = new Web3Connector();
let web3Connected = web3Connector.getWeb3Connected({
  nodeUrl: NODE_URL,
  privateKey: PRIVATE_KEY,
});

const eightFin = new EightFinConnector(
  web3Connected,
  {
    eightFin: EIGHT_FIN_TOKEN,
  }
);

const runner = async function () {
  const result = await eightFin.transfer(
    "0xd8F394357FCF5D115459DE3C362ec49C2ae174c1",
    1
  );
  console.log(result);
};
runner();
