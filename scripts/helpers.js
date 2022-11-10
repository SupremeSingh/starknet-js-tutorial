import dotenv from "dotenv";
import { Provider, ec, Account} from "starknet";
import readline from "readline";

dotenv.config();

export function getProvider() {
    // Initialize provider
    const INFURA_ID = process.env.INFURA_ID;

    if (!INFURA_ID) {
        throw "Please provide the environment variable: INFURA_ID";
    }
    return new Provider({
        rpc: {
          nodeUrl: "https://starknet-goerli.infura.io/v3/" + INFURA_ID,
        },
      });
} 

export function getAccountFromPk(provider) {
  let address = process.env.ACCOUNT_ADDRESS;
  let privateKey = process.env.PRIVATE_KEY;

  const starkKeyPair = ec.getKeyPair(privateKey);
  return new Account(provider, address, starkKeyPair);
}

export function askQuestion(query) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  
    return new Promise((resolve) =>
      rl.question(query, (ans) => {
        rl.close();
        resolve(ans);
      })
    );
  }
  