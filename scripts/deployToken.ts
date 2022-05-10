// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import configts from "../config"

const name = configts.name;
const symbol = configts.symbol;
const decimals = configts.decimals;
const totalSupply = ethers.utils.parseUnits(configts.totalSupply, decimals);

async function main() {

  // We get the contract to deploy
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(name, symbol, decimals, totalSupply);

  await token.deployed();
  
  console.log("Token deployed to:", token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
