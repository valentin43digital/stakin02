import { expect } from "chai";
import { BigNumber, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { Token } from "../typechain";
import config from "../hardhat.config";
import configts from "../config"


async function fillBalance() {
  
}

describe("Staking contract", function () {
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;
  let token: Contract;
  let staking: Contract;
  let number: BigNumber;
  const name = configts.name;
  const symbol = configts.symbol;
  const decimals = configts.decimals;
  const amount1 = ethers.utils.parseUnits(configts.amount1, decimals);
  const amount2 = ethers.utils.parseUnits(configts.amount2, decimals);;
  const totalSupply = ethers.utils.parseUnits(configts.totalSupply, decimals);

  beforeEach(async function(){
    [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token", owner);
    token = await Token.deploy(name, symbol, decimals, totalSupply);
    await token.deployed();
    const Staking = await ethers.getContractFactory("Staking", owner);
    staking = await Staking.deploy(token.address);
    await staking.deployed();
  })

  describe("Deployment", function() {
    it("Staking should be deployed", async function () {
      expect(staking.address).to.be.properAddress;
    })
  })

  describe("Staking", function(){
    it("should be possible to stake", async function () {
      await token.approve(staking.address, amount1);
      await staking.stake(amount1);
      expect(await token.balanceOf(staking.address)).to.equal(amount1);
      //expect(staking.balances(owner.getAddress())).to.equal(amount1);
    })
    it("should be impossible to stake again", async function () {
      await token.approve(staking.address, amount1);
      await staking.stake(amount1);
      await token.approve(staking.address, amount1);
      await expect(staking.stake(amount1)).to.be.revertedWith("Already staked");
    })
    it("should be possible to unstake", async function () {
      const balance = await token.balanceOf(owner.getAddress());
      await token.approve(staking.address, amount1);
      await staking.stake(amount1);
      expect(await token.balanceOf(owner.getAddress())).to.equal(balance.sub(amount1));
      expect(await token.balanceOf(staking.address)).to.equal(amount1);
      console.log("Contract balance = ", await token.balanceOf(staking.address));
      await staking.unstake();
      //expect(await token.balanceOf(owner.getAddress())).to.equal(balance);
    })
    it("should be impossible to unstake before staking", async function () {
      await expect(staking.unstake()).to.be.revertedWith("Zero balance staked");
    })


  })
});