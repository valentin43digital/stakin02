import { task } from "hardhat/config";
import configts from "../config"

task("checkreward", "Checks reward from staking")
.setAction(async (taskArgs, { ethers }) => {
  const staking = await ethers.getContractAt("Staking", configts.STAKINGADDRESS)
  await staking.checkReward()
});

//npx hardhat --network rinkeby checkreward
