import fs from "fs";
import { getAccountFromPk, getProvider } from "../scripts/helpers.js";
import { Contract, json, number } from "starknet";

let provider = getProvider();
let account = getAccountFromPk(provider);

console.log("Reading ERC20 Contract...");
const compiledErc20 = json.parse(
  fs.readFileSync("builds/ERC20.json").toString("ascii")
);
const erc20Address = "0x66aa72ce2916bbfc654fd18f9c9aaed29a4a678274639a010468a948a5e2a96";
let erc20 = new Contract(compiledErc20.abi, erc20Address, provider);

erc20.connect(account);

// Check balance -
console.log(`Calling StarkNet for account balance...`);

const balanceBeforeTransfer = await erc20.balanceOf(account.address);

console.log(
  `account Address ${account.address} has: \n`,
  number.toBN(balanceBeforeTransfer.res, 16).toString()
);

let account_nonce_bn = await account.getNonce();
const account_nonce = number.toBN(account_nonce_bn).toNumber();
console.log(`Account has a nonce of ${account_nonce}`);

console.log(
  `////////////////////////////////////////////////////////////////////////////////
    Estimating gas fees and minting 20 tokens to ${account.address}...
   ////////////////////////////////////////////////////////////////////////////////`
);

const { overall_fee } = await account.estimateInvokeFee(
  {
    contractAddress: erc20.address,
    entrypoint: "mint",
    calldata: [erc20.address, "20", '0'],
  },
);

console.log(`A transfer will cost you ${number.toBN(overall_fee).toString()} gas`);

// Execute transfer of ERC20 tokens
const { transaction_hash } = await account.execute(
  {
    contractAddress: erc20Address,
    entrypoint: 'mint',
    calldata: [account.address, '20', '0'],
  },
  undefined,
  { account_nonce }
);

// Wait for the invoke transaction to be accepted on StarkNet
console.log(
  `////////////////////////////////////////////////////////////////////////////////
    Waiting for Tx to be Accepted on Starknet - Transfer...
   ////////////////////////////////////////////////////////////////////////////////`
);

await provider.waitForTransaction(transferTxHash);

// Check balance after transfer - should be 20
console.log(`Calling StarkNet for account balance...`);
const balanceAfterTransfer = await erc20.balance_of(account.address);

console.log(
  `account Address ${account.address} has a balance of:`,
  number.toBN(balanceAfterTransfer.res, 16).toString()
);