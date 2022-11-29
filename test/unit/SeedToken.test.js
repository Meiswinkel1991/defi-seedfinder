const { assert, expect } = require("chai");
const { ethers, network, deployments } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("SeedToken Unit Test", () => {
      let owner, badActor, seedToken;

      beforeEach(async () => {
        [owner, badActor] = await ethers.getSigners();

        await deployments.fixture("all");

        seedToken = await ethers.getContract("SeedToken");
      });

      describe("#mint", () => {
        it("successfully mint new dSeed", async () => {
          const _amount = ethers.utils.parseEther("100");
          await seedToken.mint(owner.address, _amount);
        });
      });
    });
