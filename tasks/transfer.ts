import { task } from "hardhat/config";
import configts from "../config"

task("transfer", "Transfers tokens to address")
.addParam("address", "Address to transfer to")
.addParam("amount", "Amount to transfer")
.setAction(async (taskArgs, { ethers }) => {
  const token = await ethers.getContractAt("Token", configts.CONTRACT_ADDRESS)
  await token.transfer(taskArgs.address, taskArgs.amount)
});

//npx hardhat --network localhost transfer --address "0x108691CA61e04bC948FA2c17300CEEF4eEa83dc9" --amount "100"
