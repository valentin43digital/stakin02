import { expect } from "chai";
import { BigNumber, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { Token } from "../typechain";
import config from "../hardhat.config";
import configts from "../config"

describe("Token contract", function () {
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;
  let token: Contract;
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
  })

  describe("Deployment", function() {
    it("should be deployed", async function () {
      expect(token.address).to.be.properAddress;
    })
    it("should set the right owner", async function () {
      expect(await token.owner()).to.equal(await owner.getAddress());
    })
    it("should set the right name", async function () {
      expect(await token.name()).to.equal(name);
    })
    it("should set the right symbol", async function () {
      expect(await token.symbol()).to.equal(symbol);
    })
    it("should set the right decimals", async function () {
      console.log(await token.decimals());
      expect(await token.decimals()).to.equal(parseInt(decimals));
    })
    it("should set the right total supply", async function () {
      expect(await token.totalSupply()).to.equal(totalSupply);
    })
    it("should be possible to get balance", async function () {
      expect(await token.connect(addr1).balanceOf(addr1.getAddress())).to.equal(0);
    })
    it("should be possible to get allowance", async function () {
      expect(await token.connect(addr1).allowance(addr1.getAddress(), addr2.getAddress())).to.equal(0);
    })
  })

  
  describe("Transfers", function() {
    it("should be possible to transfer tokens", async function () {
      let balance = await token.connect(owner).balanceOf(owner.getAddress());
      await token.connect(owner).transfer(addr1.getAddress(), amount1);
      expect(await token.connect(addr1).balanceOf(addr1.getAddress())).to.equal(amount1);
      expect(await token.connect(owner).balanceOf(owner.getAddress())).to.equal(balance.sub(amount1));
    })
    it("should be impossible to transfer tokens when balance is lower than amount", async function () {
      await expect(token.connect(addr1).transfer(addr2.getAddress(), amount1)).to.be.revertedWith("Not enough balance");
    })
    it("should be possible to approve transfer", async function () {
      await token.connect(owner).approve(addr1.getAddress(), amount1);
      expect(await token.connect(addr1).allowance(owner.getAddress(), addr1.getAddress())).to.equal(amount1);
    })
    it("should be impossible to approve transfer for balance lower than amount", async function () {
      await expect(token.connect(addr1).approve(addr2.getAddress(), amount1)).to.be.revertedWith("Not enough balance");
    })
    it("should be possible to transfer from account after approve", async function () {
      let balance = await token.connect(owner).balanceOf(owner.getAddress());
      await token.connect(owner).approve(addr1.getAddress(), amount1);
      await token.connect(addr1).transferFrom(owner.getAddress(), addr1.getAddress(), amount1)
      expect(await token.connect(addr1).balanceOf(addr1.getAddress())).to.equal(amount1);
      expect(await token.connect(owner).balanceOf(owner.getAddress())).to.equal(balance.sub(amount1));
    })
    it("should be impossible to transfer from account when balance lower amount", async function () {

      await token.connect(owner).approve(addr1.getAddress(), amount1);
      await expect(token.connect(addr1).transferFrom(owner.getAddress(), addr1.getAddress(), amount2)).to.be.revertedWith("Not enough balance");
    })
  })

  describe("Burn and mint", function() {
    it("should be possible for owner to burn tokens", async function () {
      expect(await token.connect(owner).balanceOf(owner.getAddress())).to.equal(totalSupply);
      await token.connect(owner).burn(owner.getAddress(), amount1);
      expect(await token.connect(owner).balanceOf(owner.getAddress())).to.equal(totalSupply.sub(amount1));
    })
    it("should be impossible for non owner to burn tokens", async function () {
      await expect(token.connect(addr1).burn(addr1.getAddress(), amount1)).to.be.revertedWith("You are not owner");
    })
    it("should be impossible for owner to burn tokens more than balance", async function () {
      let balance = await token.connect(owner).balanceOf(owner.getAddress());
      let amount = balance.add(amount1);
      await expect(token.connect(owner).burn(owner.getAddress(), amount)).to.be.revertedWith("Not enough balance");
    })
    it("should be possible for owner to mint tokens", async function () {
      expect(await token.connect(owner).balanceOf(owner.getAddress())).to.equal(totalSupply);
      await token.connect(owner).mint(owner.getAddress(), amount1);
      expect(await token.connect(owner).balanceOf(owner.getAddress())).to.equal(totalSupply.add(amount1));
    })
    it("should be impossible for non owner to mint tokens", async function () {
      await expect(token.connect(addr1).mint(addr1.getAddress(), amount1)).to.be.revertedWith("You are not owner");
    })
  })




  
});
  