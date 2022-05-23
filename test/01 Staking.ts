import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";
import { Token } from "../typechain";
import config from "../hardhat.config";
import configts from "../config"
import "@uniswap/v2-core/build/UniswapV2Factory.json"
//import IUniswapV2FactoryArtifacts from "./artifacts/contracts/IUniswapV2Factory.sol/IUniswapV2Factory.json";
const IUniswapV2Router02Artifacts = require("./artifacts/contracts/IUniswapV2Router02.sol/IUniswapV2Router02.json");
const IUniswapV2FactoryArtifacts = require("../artifacts/contracts/IUniswapV2Factory.sol/IUniswapV2Factory.json");


async function fillBalance() {
  
}

describe("Staking contract", function () {

  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let uniswapV2Factory;
  let uniswapV2Router02;


  let token: Contract;
  let uniswap: Contract;
  let staking: Contract;
  let number: BigNumber;
  const name = configts.name;
  const symbol = configts.symbol;
  const decimals = configts.decimals;
  const amount1 = ethers.utils.parseUnits(configts.amount1, decimals);
  const amount2 = ethers.utils.parseUnits(configts.amount2, decimals);
  const amount3 = ethers.utils.parseUnits(configts.amount3, decimals);
  const totalSupply = ethers.utils.parseUnits(configts.totalSupply, decimals);

  beforeEach(async function(){
    [owner, addr1, addr2] = await ethers.getSigners();

    uniswapV2Factory = new ethers.Contract(configts.uniswapV2factoryAddress, IUniswapV2FactoryArtifacts.abi, owner);
    uniswapV2Router02 = new ethers.Contract(configts.uniswapV2Router02address, IUniswapV2Router02Artifacts.abi, owner);
  
    const Token = await ethers.getContractFactory("Token", owner);
    token = await Token.deploy(name, symbol, decimals, totalSupply);
    await token.deployed();

    await uniswapV2Factory.createPair(token.address, configts.WETHADDRESS);
    await uniswapV2Router02.addLiquidityETH(
      token.address,

            t20,
            t10,
            t20,
            owner.address,
            lastblock.timestamp + 3600,
            options);


    const Staking = await ethers.getContractFactory("Staking", owner);
    staking = await Staking.deploy(token.address, token.address);
    await staking.deployed();
  })

  describe("Deployment", function() {
    it("Staking should be deployed", async function () {
      expect(staking.address).to.be.properAddress;
    })
  })

  // describe("Staking", function(){
  //   it("should be possible to stake", async function () {
  //     await token.approve(staking.address, amount1);
  //     await staking.stake(amount1);
  //     expect(await token.balanceOf(staking.address)).to.equal(amount1);
  //     //expect(staking.balances(owner.getAddress())).to.equal(amount1);
  //   })
  //   it("should be impossible to stake again", async function () {
  //     await token.approve(staking.address, amount1);
  //     await staking.stake(amount1);
  //     await token.approve(staking.address, amount1);
  //     await expect(staking.stake(amount1)).to.be.revertedWith("Already staked");
  //   })
  //   it("should be possible to unstake", async function () {
  //     const balance = await token.balanceOf(owner.getAddress());
  //     await token.approve(staking.address, amount1);
  //     await staking.stake(amount1);
  //     expect(await token.balanceOf(owner.getAddress())).to.equal(balance.sub(amount1));
  //     expect(await token.balanceOf(staking.address)).to.equal(amount1);
  //     console.log("Contract balance = ", await token.balanceOf(staking.address));
  //     await staking.unstake(amount3);
  //     expect(await token.balanceOf(owner.getAddress())).to.equal(balance.sub(amount1).add(amount3));
  //   })
  //   it("should be impossible to unstake before staking", async function () {
  //     await expect(staking.unstake(amount1)).to.be.revertedWith("Zero balance staked");
  //   })


  // })
});