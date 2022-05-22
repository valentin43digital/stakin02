import { task } from "hardhat/config";
import configts from "../config"

task("balanceOf", "Gets balance of address")
//.addParam("tokenaddress", "Token address to work with")
.addParam("address", "Address to get balance of")
.setAction(async (taskArgs, { ethers }) => {
  const token = await ethers.getContractAt("Token", configts.REWARDTOKENADDRESS)
  const balance = await token.balanceOf(taskArgs.address)
  console.log(balance, "tokens");
});

//npx hardhat --network rinkeby balanceOf --address "0x830736E9E5A24cA5D653505bfD97A92df558b8DC"
