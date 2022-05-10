import { task } from "hardhat/config";
import configts from "../config"

task("transferFrom", "Transfers tokens from account")
.addParam("from", "Address of spender")
.addParam("to", "Address of spender")
.addParam("amount", "Amount to transfer")
.setAction(async (taskArgs, { ethers }) => {
  const token = await ethers.getContractAt("Token", configts.CONTRACT_ADDRESS)
  await token.transferFrom(taskArgs.from, taskArgs.to, taskArgs.amount)
});

//npx hardhat --network localhost transferFrom --from 0x4fA8DD85Ea24975a3028A05BA0c6bDeada7f7530 --to "0x108691CA61e04bC948FA2c17300CEEF4eEa83dc9" --amount "100"
