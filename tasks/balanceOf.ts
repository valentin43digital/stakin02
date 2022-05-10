import { task } from "hardhat/config";
import configts from "../config"

task("balanceOf", "Gets balance of address")
.addParam("address", "Address to get balance of")
.setAction(async (taskArgs, { ethers }) => {
  const token = await ethers.getContractAt("Token", configts.CONTRACT_ADDRESS)
  const balance = await token.balanceOf(taskArgs.address)
  console.log(balance, "tokens");
});

//npx hardhat --network localhost balanceOf --address "0x4fA8DD85Ea24975a3028A05BA0c6bDeada7f7530"
