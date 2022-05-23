// import { expect } from "chai";
// import { BigNumber, Contract, Signer } from "ethers";
// import { ethers } from "hardhat";
// import { Token } from "../typechain";
// import config from "../hardhat.config";
// import configts from "../config"
// import { Console } from "console";

// describe("Token contract", function () {
//     let owner: Signer;
//     let addr1: Signer;
//     let addr2: Signer;
//     let token: Contract;
    
//     beforeEach(async function(){
//         [owner, addr1, addr2] = await ethers.getSigners();
//         const Token = await ethers.getContractFactory("Token", owner);
//         token = await Token.attach(configts.REWARDTOKENADDRESS);
        
//         //token = await Token.deploy(name, symbol, decimals, totalSupply);
//         //await token.deployed();
//       })

//     describe("Deployment", function() {
//         it("should be proper address", async function () {
//             expect(token.address).to.equal(configts.REWARDTOKENADDRESS);
//         })
//         it("should be balance of", async function () {
//             console.log(await token.balanceOf("0x4fA8DD85Ea24975a3028A05BA0c6bDeada7f7530"));
            
//             //expect(await token.balanceOf("0x4fA8DD85Ea24975a3028A05BA0c6bDeada7f7530")).to.equal(0);
//         })
//     })
// });