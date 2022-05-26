import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, constants, Contract } from "ethers";
import { ethers } from "hardhat";
//import { Token } from "../typechain";
import config from "../hardhat.config";
import configts from "../config"

const {isCallTrace} = require("hardhat/internal/hardhat-network/stack-traces/message-trace")

describe("Token contract", function () {
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
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
    token = await Token.deploy(name, symbol, totalSupply);
    await token.deployed();
  })

  describe("Deployment", function() {
    it("should be deployed", async function () {
      expect(token.address).to.be.properAddress;
    })

    it("should set the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    })

    it("should set the right name", async function () {
      expect(await token.name()).to.equal(name);
    })

    it("should set the right symbol", async function () {
      expect(await token.symbol()).to.equal(symbol);
    })

    it("should set the right decimals", async function () {
      expect(await token.decimals()).to.equal(parseInt(decimals));
    })

    it("should set the right total supply", async function () {
      expect(await token.totalSupply()).to.equal(totalSupply);
    })

    it("should be possible to get balance", async function () {
      let tx = await token.connect(addr1).balanceOf(addr1.address);
      expect(tx).to.equal(0);
    })

    it("should be possible to get allowance", async function () {
      let tx = await token.connect(addr1).allowance(addr1.address, addr2.address);
      expect(tx).to.equal(0);
    })
  })

  describe("Transfer", function() {
    it("should be possible to transfer tokens", async function () {
      let balance = await token.connect(owner).balanceOf(owner.address);
      await token.connect(owner).transfer(addr1.address, amount1);
      let tx1 = await token.connect(addr1).balanceOf(addr1.address);
      expect(tx1).to.equal(amount1);
      let tx2 = await token.connect(owner).balanceOf(owner.address);
      expect(tx2).to.equal(balance.sub(amount1));
    })

    it("should be impossible to transfer tokens when balance is lower than amount", async function () {
      let tx = token.connect(addr1).transfer(addr2.address, totalSupply);
      await expect(tx).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    })

    it("should be possible to approve transfer", async function () {
      await token.connect(owner).approve(addr1.address, amount1);
      let tx = await token.connect(addr1).allowance(owner.address, addr1.address);
      expect(tx).to.equal(amount1);
    })

    // it("should be impossible to approve transfer for balance lower than amount", async function () {
    //   let tx = token.connect(addr1).approve(addr2.address, amount1);
    //   await expect(tx).to.be.revertedWith("Not enough balance");
    // })
  })

  describe("Transfer from", function() {
    it("should be possible to transfer from account after approve", async function () {
      let balance = await token.connect(owner).balanceOf(owner.address);
      await token.connect(owner).approve(addr1.address, amount1);
      await token.connect(addr1).transferFrom(owner.address, addr1.address, amount1)

      expect(await token.connect(addr1).balanceOf(addr1.address)).to.equal(amount1);
      expect(await token.connect(owner).balanceOf(owner.address)).to.equal(balance.sub(amount1));
    })

    it("should be impossible to transfer from account when balance is lower than amount", async function () {
      await token.connect(owner).approve(addr1.address, amount1);
      await token.connect(owner).transfer(addr2.address, totalSupply);
      let tx = token.connect(addr1).transferFrom(owner.address, addr1.address, amount1);
      await expect(tx).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    })

    it("should be impossible to transfer from account when allowance is lower than amount", async function () {
        await token.connect(owner).approve(addr1.address, amount2);
        let tx = token.connect(addr1).transferFrom(owner.address, addr1.address, amount1);
        await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
      })
  })

  describe("Mint", function() {
    it("should be possible for owner to mint tokens", async function () {
      expect(await token.connect(owner).balanceOf(owner.address)).to.equal(totalSupply);
      await token.connect(owner).mint(owner.address, amount1);
      let tx = await token.connect(owner).balanceOf(owner.address);
      expect(tx).to.equal(totalSupply.add(amount1));
    })
    
    it("should be impossible for non owner to mint tokens", async function () {
      let tx = token.connect(addr1).mint(addr1.address, amount1);
      await expect(tx).to.be.revertedWith("You are not owner");
    })

    it("should be impossible to mint tokens to zero address", async function () {
      let tx = token.connect(owner).mint(constants.AddressZero, amount1);
      await expect(tx).to.be.revertedWith("ERC20: mint to the zero address");
    })
  })
});
  