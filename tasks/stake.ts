import { task } from "hardhat/config";
import configts from "../config"

task("stake", "Stakes LP tokens to staking")
.addParam("amount", "Amount to stake")
.setAction(async (taskArgs, { ethers }) => {
  const staking = await ethers.getContractAt("Staking", configts.STAKINGADDRESS)
  await staking.stake(taskArgs.amount)
});

//npx hardhat --network rinkeby stake --amount "10000000000000000000"
