import { task } from "hardhat/config";
import configts from "../config"

task("approve", "Approves transfer of tokens")
//.addParam("tokenAddress", "Token address to work with")
.addParam("address", "Address of spender")
.addParam("amount", "Amount to transfer")
.setAction(async (taskArgs, { ethers }) => {
  const token = await ethers.getContractAt("Token", configts.LPTOKENADDRESS)
  await token.approve(taskArgs.address, taskArgs.amount)
});

//npx hardhat --network rinkeby approve --address "0x830736E9E5A24cA5D653505bfD97A92df558b8DC" --amount "10000000000000000000"
