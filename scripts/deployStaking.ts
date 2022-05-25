// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import configts from "../config";

const lpTokenAddress = configts.LPTOKENADDRESS;
const rewardTokenAddress = configts.ATOKENADDRESS;

async function main() {

  // We get the contract to deploy
  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(lpTokenAddress, rewardTokenAddress);

  await staking.deployed();
  
  console.log("Staking deployed to:", staking.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run --network rinkeby scripts/deployStaking.ts 