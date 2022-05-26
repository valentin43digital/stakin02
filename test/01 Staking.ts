import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import hre from "hardhat";
import config from "../hardhat.config";
import configts from "../config"
import {abi as IUniswapV2FactoryABI} from '@uniswap/v2-core/build/IUniswapV2Factory.json'
import {abi as IUniswapV2Router02ABI} from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import {abi as IUniswapV2PairABI} from '@uniswap/v2-core/build/IUniswapV2Pair.json'


async function makeStake(staking: Contract, uniswapV2Pair: Contract, amount: BigNumber) {
  await uniswapV2Pair.approve(staking.address, amount);
  await staking.stake(amount);
}


describe("Staking contract", function () {

  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  let token1: Contract;
  let token2: Contract;
  let uniswapV2Factory: Contract;
  let uniswapV2Router02: Contract;
  let uniswapV2Pair: Contract;
  let staking: Contract;

  const pairNumber = 57143;  //pair number created in Uniswap
  const name = configts.name;
  const name2 = configts.name2;
  const symbol = configts.symbol;
  const decimals = configts.decimals;
  const initBalance = ethers.utils.parseUnits("99.999999999999999", decimals);
  const oneTimeReward = ethers.utils.parseUnits("16", decimals);
  const amount1 = ethers.utils.parseUnits(configts.amount1, decimals);
  const amount2 = ethers.utils.parseUnits(configts.amount2, decimals);
  const amount3 = ethers.utils.parseUnits(configts.amount3, decimals);
  const totalSupply = ethers.utils.parseUnits(configts.totalSupply, decimals);

  beforeEach(async function(){
    [owner, addr1, addr2] = await ethers.getSigners();
  
    const Token = await ethers.getContractFactory("Token", owner);
    token1 = await Token.deploy(name, symbol, totalSupply);
    token2 = await Token.deploy(name2, symbol, totalSupply);
    await token1.deployed();
    await token2.deployed();
    uniswapV2Factory = new ethers.Contract(configts.uniswapV2FactoryAddress, IUniswapV2FactoryABI, owner);
    uniswapV2Router02 = new ethers.Contract(configts.uniswapV2Router02address, IUniswapV2Router02ABI, owner);
    await uniswapV2Factory.createPair(token1.address, token2.address);
    await token1.approve(uniswapV2Router02.address, amount1);
    await token2.approve(uniswapV2Router02.address, amount1);
    let latestBlock = await hre.ethers.provider.getBlock("latest");
    await uniswapV2Router02.addLiquidity(token1.address, token2.address, amount1, amount1, amount2, amount2, owner.address, latestBlock.timestamp+3600);
    const poolAddress = await uniswapV2Factory.getPair(token1.address, token2.address);
    uniswapV2Pair = new ethers.Contract(poolAddress, IUniswapV2PairABI, owner);
    const Staking = await ethers.getContractFactory("Staking", owner);
    staking = await Staking.deploy(uniswapV2Pair.address, token1.address);
    await staking.deployed();
    await token1.mint(staking.address, totalSupply);
  })

  describe("Deployment", function() {
    it("Tokens must be deployed", async function () {
      expect(token1.address).to.be.properAddress;
      expect(token2.address).to.be.properAddress;
    })

    it("Pool must be created", async function () {
      let tx = await uniswapV2Pair.balanceOf(owner.address);
      expect(tx)
      .to.eq(initBalance);
    })

    it("Staking should be deployed", async function () {
      expect(staking.address).to.be.properAddress;
    })
  })

  describe("Staking", function() {
    it("Should be possible to stake", async function () {
      await makeStake(staking, uniswapV2Pair, amount2); // stake 80 LPtokens
      let tx = await uniswapV2Pair.balanceOf(staking.address);
      expect(tx).to.equal(amount2); // 80 LPtokens staking contract recieved

      const [balance,] = await staking.stakeholders(owner.address);
      expect(balance).to.eq(amount2); // 80 LPtokens user recieved in contract balance
    })

    it("Should be possible to stake twice", async function () {
      await makeStake(staking, uniswapV2Pair, amount3) // stake 40 LPtokens
      await makeStake(staking, uniswapV2Pair, amount3) // stake 40 LPtokens
      expect(await uniswapV2Pair.balanceOf(staking.address)).to.equal(amount2); // 80 LPtokens staking contract recieved
      const [balance,] = await staking.stakeholders(owner.address);
      expect(balance).to.eq(amount2); // 80 LPtokens user recieved in contract balance
    })

    it("Should be impossible to stake without approve", async function () {
      let tx = staking.stake(amount2);
      await expect(tx)
      .to.be.revertedWith("No enough allowance")
    })
  })
  
  describe("Unstaking", function() {
    it("should be possible to unstake", async function () {
      await makeStake(staking, uniswapV2Pair, amount2) // stake 80 LPtokens
      await staking.unstake(amount3); // unstake 40 LPtokens

      let tx1 = await uniswapV2Pair.balanceOf(staking.address);
      expect(tx1)
      .to.equal(amount3); // 40 LPtokens left staked
      
      const [balance,] = await staking.stakeholders(owner.address);
      expect(balance)
      .to.eq(amount3); // 40 LPtokens left staked

      let tx2 = await uniswapV2Pair.balanceOf(owner.address);
      expect(tx2)
      .to.equal(initBalance.sub(amount3)); // 99-40 LPtokens
    })

    it("should be impossible to unstake before staking", async function () {
      let tx = staking.unstake(amount1);
      await expect(tx)
      .to.be.revertedWith("Zero balance staked");
    })

    it("should be impossible to unstake more than staked", async function () {
      await makeStake(staking, uniswapV2Pair, amount3) // stake 40 LPtokens
      let tx = staking.unstake(amount2);
      await expect(tx)
      .to.be.revertedWith("Not enough balance staked"); // try to unstake 80 LPtokens
    })
  })
  
  describe("Getting reward", function() {
    it("should be possible to claim reward", async function () {
      let balanceBefore = await token1.balanceOf(owner.address); // 999900 Tokens
      await uniswapV2Pair.approve(staking.address, amount2);
      await staking.stake(amount2); // 80 LPtokens
      let latestBlock = await hre.ethers.provider.getBlock("latest");
      await hre.ethers.provider.send("evm_mine", [latestBlock.timestamp + 700]);
      await staking.claim();
      expect(await token1.balanceOf(owner.address)).to.eq(balanceBefore.add(oneTimeReward)); // 999916 Tokens
    })

    it("should be impossible to claim reward before time period passed", async function () {
      await uniswapV2Pair.approve(staking.address, amount2);
      await staking.stake(amount2); // 80 LPtokens
      let latestBlock = await hre.ethers.provider.getBlock("latest");
      await hre.ethers.provider.send("evm_mine", [latestBlock.timestamp + 300]);
      let tx = staking.claim();
      await expect(tx)
      .to.be.revertedWith("Time not passed");
    })


  })
  
  describe("Extra Settings", function() {
    it("should be possible to set time period", async function () {
      await staking.setTimePeriod(200);
      let tx = await staking.timePeriod();
      expect(tx)
      .to.eq(200);
    })

    it("should be impossible to set time period for not owner", async function () {
      let tx = staking.connect(addr1).setTimePeriod(200)
      await expect(tx)
      .to.be.revertedWith("You are not owner");
    })


  })
});