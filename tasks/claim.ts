import { task } from "hardhat/config";
import configts from "../config"

task("claim", "Claims reward from staking")
.setAction(async (taskArgs, { ethers }) => {
  const staking = await ethers.getContractAt("Staking", configts.STAKINGADDRESS)
  await staking.claim()
});

//npx hardhat --network rinkeby checkreward
