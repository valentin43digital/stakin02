import { task } from "hardhat/config";
import configts from "../config"

task("unstake", "Unstakes LP tokens from staking")
.addParam("amount", "Amount to unstake")
.setAction(async (taskArgs, { ethers }) => {
  const staking = await ethers.getContractAt("Staking", configts.STAKINGADDRESS)
  await staking.unstake(taskArgs.amount)
});

//npx hardhat --network rinkeby unstake --amount "10000000000000000000"
